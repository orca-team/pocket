import type { mat3 } from 'gl-matrix';
import pc from 'prefix-classnames';

export type ResizeType = 'keyboard' | 'rotate' | 'move' | 'top' | 'left' | 'bottom' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export type Bounds = {
  top: number;
  left: number;
  width: number;
  height: number;
  rotate?: number;
};

export type Point = {
  x: number;
  y: number;
};

const PREFIX = 'orca-transformer-box';
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
  } else if (classList.includes(px('rotate-handle'))) {
    return 'rotate';
  }
  return 'move';
}

export type CalcPropsChangeOptions = {
  resizeType?: ResizeType;
  eqRatio?: boolean;
  symmetrical?: boolean;
};

export function rad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function deg(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function getTransformInfo(matrix: mat3): { x: number; y: number; width: number; height: number; rotate: number } {
  const x = matrix[6];
  const y = matrix[7];
  const width = Math.sqrt(matrix[0] ** 2 + matrix[1] ** 2);
  const height = Math.sqrt(matrix[3] ** 2 + matrix[4] ** 2);
  const rotate = deg(Math.atan2(matrix[1], matrix[0]));
  return { x, y, width, height, rotate };
}

/**
 * 计算 bounds 的变化
 * @param startBounds 原始 bounds
 * @param pointOffset 鼠标偏移
 * @param options
 */
// export function calcBoundsChangeNew(startBounds: Bounds, pointOffset: Point, options: CalcPropsChangeOptions = {}): Partial<Bounds> {
//   const { top, left, width, height, rotate = 0 } = startBounds;
//   // const mat = mat3.create();
//   // const translateMat = mat3.create();
//   // mat3.translate(translateMat, translateMat, vec2.fromValues(left, top));
//   // const scaleMat = mat3.create();
//   // mat3.scale(scaleMat, scaleMat, vec2.fromValues(width, height));
//   // const rotateMat = mat3.create();
//   // mat3.rotate(rotateMat, rotateMat, rad(rotate));
//   //
//   // mat3.multiply(mat, mat, translateMat);
//   // mat3.multiply(mat, mat, scaleMat);
//   // mat3.multiply(mat, mat, rotateMat);
//
//   const cos = Math.cos(rad(rotate));
//   const sin = Math.sin(rad(rotate));
//   const mat = mat3.fromValues(
//     width * cos,
//     width * sin,
//     0,
//     -height * sin,
//     height * cos,
//     0,
//     left,
//     top,
//     1,
//   );
//
//   // console.log(getTransformInfo(mat));
// }

/**
 * 计算 bounds 的变化
 * @param startBounds 原始 bounds
 * @param pointOffset 鼠标偏移
 * @param options
 */
export const calcBoundsChange = (startBounds: Bounds, _currentPoint: Point, pointOffset: Point, options: CalcPropsChangeOptions = {}): Partial<Bounds> => {
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
  // 当前位置（需要基于 pointOffset 算出来
  const currentPoint = { ...centerPoint };
  // 基准点，缩放的基准
  const basePoint = { ...centerPoint };

  // 如果是旋转操作
  if (resizeType === 'rotate') {
    currentPoint.x = centerPoint.x + pointOffset.x;
    currentPoint.y = startBounds.top - 32 + pointOffset.y;
    const x = currentPoint.x - centerPoint.x;
    const y = currentPoint.y - centerPoint.y;
    const rotate = (Math.atan2(x, -y) / Math.PI) * 180;
    return {
      ...startBounds,
      rotate,
    };
  }

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

  // 计算 basePoint 位置
  // currentPoint 刚好和 basePoint 取反
  if (affectTop) {
    basePoint.y = startBounds.top + startBounds.height;
    currentPoint.y = startBounds.top;
  }
  if (affectBottom) {
    basePoint.y = startBounds.top;
    currentPoint.y = startBounds.top + startBounds.height;
  }
  if (affectLeft) {
    basePoint.x = startBounds.left + startBounds.width;
    currentPoint.x = startBounds.left;
  }
  if (affectRight) {
    basePoint.x = startBounds.left;
    currentPoint.x = startBounds.left + startBounds.width;
  }
  if (symmetrical) {
    // 如果是以中心为基点变化，则 basePoint 就是 centerPoint
    basePoint.x = centerPoint.x;
    basePoint.y = centerPoint.y;
  }

  // currentPoint 偏移
  currentPoint.x += pointOffset.x;
  currentPoint.y += pointOffset.y;

  // 计算得出需要缩放的比例
  const xRatio = ((symmetrical ? 2 : 1) * Math.max(minSize, Math.abs(currentPoint.x - basePoint.x))) / startBounds.width;
  const yRatio = ((symmetrical ? 2 : 1) * Math.max(minSize, Math.abs(currentPoint.y - basePoint.y))) / startBounds.height;

  if (eqRatio) {
    // 等比
    // eslint-disable-next-line no-nested-ternary
    let ratio = Math.max(xRatio, yRatio);
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
