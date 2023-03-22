import pc from 'prefix-classnames';

export type ResizeType = 'keyboard' | 'rotate' | 'move' | 'top' | 'left' | 'bottom' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export type Bounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type Point = {
  x: number;
  y: number;
};

const PREFIX = 'abs-comp-border';
const px = pc(PREFIX);

const minSize = 10;

export function getResizeMode(classList: string[]): ResizeType {
  if (classList.includes(px('root'))) {
    return 'move';
  } else if (classList.includes(px('scale-handle-top'))) {
    return 'top';
  } else if (classList.includes(px('scale-handle-bottom'))) {
    return 'bottom';
  } else if (classList.includes(px('scale-handle-right'))) {
    return 'right';
  } else if (classList.includes(px('scale-handle-left'))) {
    return 'left';
  } else if (classList.includes(px('scale-handle-top-left'))) {
    return 'topLeft';
  } else if (classList.includes(px('scale-handle-top-right'))) {
    return 'topRight';
  } else if (classList.includes(px('scale-handle-bottom-left'))) {
    return 'bottomLeft';
  } else if (classList.includes(px('scale-handle-bottom-right'))) {
    return 'bottomRight';
  }
  return 'move';
}

export type CalcPropsChangeOptions = {
  resizeType?: ResizeType;
  eqRatio?: boolean;
  symmetrical?: boolean;
};

/**
 * 计算 bounds 的变化
 * @param startBounds 原始 bounds
 * @param pointOffset 鼠标偏移
 * @param options
 */
export const calcBoundsChange = (startBounds: Bounds, currentPoint: Point, pointOffset: Point, options: CalcPropsChangeOptions = {}): Partial<Bounds> => {
  const { resizeType = 'move', eqRatio = false, symmetrical = false } = options;
  const { x, y } = pointOffset;
  const { top, left, width, height } = startBounds;
  if (resizeType === 'move') {
    /* 目标是框本身，平移 */
    return { left: left + x, top: top + y };
  }

  // 基准点
  const centerPoint = {
    x: startBounds.left + 0.5 * startBounds.width,
    y: startBounds.top + 0.5 * startBounds.height,
  };
  const basePoint = { ...centerPoint };

  // 根据鼠标偏移，在不影响最小值的情况下，计算出上下左右的变化范围
  const diffRight = Math.min(width - minSize, x);
  const diffLeft = Math.max(minSize - width, x);
  const diffBottom = Math.max(minSize - height, y);
  const diffTop = Math.min(height - minSize, y);

  // 默认情况下新的位置变化（复用于等比缩放）
  let newTop: Partial<Bounds> = { top: top + diffTop, height: height - diffTop };
  let newBottom: Partial<Bounds> = { height: height + diffBottom };
  let newRight: Partial<Bounds> = { width: width + diffLeft };
  let newLeft: Partial<Bounds> = { left: left + diffRight, width: width - diffRight };

  const _resizeType = resizeType.toLowerCase();
  const affectTop = _resizeType.includes('top');
  const affectLeft = _resizeType.includes('left');
  const affectRight = _resizeType.includes('right');
  const affectBottom = _resizeType.includes('bottom');
  const affectVertical = affectTop || affectBottom;
  const affectHorizontal = affectLeft || affectRight;

  if (!symmetrical) {
    // 非中心点变化，重新计算 basePoint
    if (affectTop) {
      basePoint.y = startBounds.top + startBounds.height;
    }
    if (affectBottom) {
      basePoint.y = startBounds.top;
    }
    if (affectLeft) {
      basePoint.x = startBounds.left + startBounds.width;
    }
    if (affectRight) {
      basePoint.x = startBounds.left;
    }
  }

  // 计算得出需要缩放的比例
  const xRatio = ((symmetrical ? 2 : 1) * Math.max(minSize, Math.abs(currentPoint.x - basePoint.x))) / startBounds.width;
  const yRatio = ((symmetrical ? 2 : 1) * Math.max(minSize, Math.abs(currentPoint.y - basePoint.y))) / startBounds.height;

  if (eqRatio) {
    // 等比
    // eslint-disable-next-line no-nested-ternary
    let ratio = Math.min(xRatio, yRatio);
    if (affectVertical && !affectHorizontal) {
      ratio = yRatio;
    }
    if (affectHorizontal && !affectVertical) {
      ratio = xRatio;
    }

    // 根据比例计算出新组件的宽高
    const hw = Math.round(ratio * startBounds.width);
    const hh = Math.round(ratio * startBounds.height);

    if (symmetrical) {
      // 中心等比缩放
      newTop = { top: Math.round(basePoint.y - 0.5 * hh), height: hh };
      newBottom = { top: Math.round(basePoint.y - 0.5 * hh), height: hh };
      newLeft = { left: Math.round(basePoint.x - 0.5 * hw), width: hw };
      newRight = { left: Math.round(basePoint.x - 0.5 * hw), width: hw };
    } else {
      // 等比缩放
      // eslint-disable-next-line no-lonely-if
      if (affectVertical !== affectHorizontal) {
        newTop = { top: top + height - hh, height: hh, left: left + 0.5 * (width - hw), width: hw };
        newBottom = { height: hh, left: left + 0.5 * (width - hw), width: hw };
        newLeft = {
          left: left + width - hw,
          width: hw,
          top: top + 0.5 * (height - hh),
          height: hh,
        };
        newRight = { width: hw, top: top + 0.5 * (height - hh), height: hh };
      } else {
        newTop = { top: top + height - hh, height: hh };
        newBottom = { height: hh };
        newLeft = { left: left + width - hw, width: hw };
        newRight = { width: hw };
      }
    }
  } else if (symmetrical) {
    // 中心缩放
    // 按照各自比例缩放
    const hw = Math.round(xRatio * startBounds.width);
    const hh = Math.round(yRatio * startBounds.height);
    newTop = { top: Math.round(basePoint.y - 0.5 * hh), height: hh };
    newBottom = { top: Math.round(basePoint.y - 0.5 * hh), height: hh };
    newLeft = { left: Math.round(basePoint.x - 0.5 * hw), width: hw };
    newRight = { left: Math.round(basePoint.x - 0.5 * hw), width: hw };
  }

  // 普通缩放
  switch (resizeType) {
    case 'top':
      /* 上↑ */
      return { ...startBounds, ...newTop };
    case 'bottom':
      /* 下↓ */
      return { ...startBounds, ...newBottom };
    case 'right':
      /* 右→ */
      return { ...startBounds, ...newRight };
    case 'left':
      /* 左← */
      return { ...startBounds, ...newLeft };
    case 'topLeft':
      /* 左上↖ */
      return { ...startBounds, ...newLeft, ...newTop };
    case 'topRight':
      /* 右上↗ */
      return { ...startBounds, ...newRight, ...newTop };
    case 'bottomLeft':
      /* 左下↙ */
      return { ...startBounds, ...newLeft, ...newBottom };
    case 'bottomRight':
      /* 右下↘ */
      return { ...startBounds, ...newRight, ...newBottom };
  }

  return {};
};

export const getPointByEvent = (event: PointerEvent | MouseEvent) =>
  ({
    x: event.pageX,
    y: event.pageY,
  } as Point);

export const getPointOffset = (p1: Point, p2: Point) => ({
  x: p2.x - p1.x,
  y: p2.y - p1.y,
});
