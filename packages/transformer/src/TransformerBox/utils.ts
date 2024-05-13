import { mat3, vec2 } from 'gl-matrix';
import pc from 'prefix-classnames';
import { roundBy } from '@orca-fe/tools';

const roundBy5 = roundBy(5);
const roundBy45 = roundBy(45);

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

const round = roundBy(0.001);

/**
 * 获取变换信息（位置和旋转）
 * @param matrix 变换矩阵
 * @returns { x: number; y: number; rotate: number } 变换信息
 */
export function getTransformInfo(matrix: mat3): { x: number; y: number; rotate: number } {
  const x = matrix[6];
  const y = matrix[7];
  // const width = round(Math.sqrt(matrix[0] ** 2 + matrix[1] ** 2));
  // const height = round(Math.sqrt(matrix[3] ** 2 + matrix[4] ** 2));
  const rotate = round(deg(Math.atan2(matrix[1], matrix[0])));
  return { x, y, rotate };
}

/**
 * 旋转矩阵 matrix 绕点 point 旋转 angle 角度
 * @param matrix 变换矩阵
 * @param point 旋转点
 * @param angle 旋转角度
 * @returns 旋转后的矩阵
 */
function rotateMatrixAroundPoint(matrix: mat3, point: Point, angle: number): mat3 {
  const translationMatrix = mat3.fromTranslation(mat3.create(), [point.x, point.y]);
  const rotationMatrix = mat3.fromRotation(mat3.create(), angle);
  const inverseTranslationMatrix = mat3.fromTranslation(mat3.create(), [-point.x, -point.y]);
  const resultMatrix = mat3.create();
  mat3.multiply(resultMatrix, translationMatrix, rotationMatrix);
  mat3.multiply(resultMatrix, resultMatrix, inverseTranslationMatrix);
  mat3.multiply(resultMatrix, resultMatrix, matrix);
  return resultMatrix;
}

/**
 * 将点投影到矩阵上
 * @param point 点
 * @param matrix 矩阵
 * @returns 投影后的点
 */
function project(point: Point, matrix: mat3): Point {
  const [x, y] = vec2.transformMat3(vec2.create(), [point.x, point.y], matrix);
  return { x, y };
}

/**
 * 将点反投影到矩阵上
 * @param point 点
 * @param matrix 矩阵
 * @returns 反投影后的点
 */
function unproject(point: Point, matrix: mat3): Point {
  const [x, y] = vec2.transformMat3(vec2.create(), [point.x, point.y], mat3.invert(mat3.create(), matrix));
  return { x, y };
}

/**
 * 计算 bounds 的变化
 * @param startBounds 原始 bounds
 * @param pointOffset 鼠标偏移
 * @param options
 */
export function calcBoundsChange(startBounds: Bounds, pointOffset: Point, options: CalcPropsChangeOptions = {}) {
  const { top, left, width, height, rotate = 0 } = startBounds;
  const { resizeType = 'move', eqRatio = false, symmetrical = false } = options;
  const { x, y } = pointOffset;

  if (resizeType === 'move') {
    /* 目标是框本身，平移 */
    return { left: left + x, top: top + y };
  }

  const mat = mat3.create();
  const translateMat = mat3.create();
  mat3.translate(translateMat, translateMat, vec2.fromValues(left, top));
  const rotateMat = mat3.create();
  mat3.rotate(rotateMat, rotateMat, rad(rotate));
  mat3.multiply(mat, mat, translateMat);
  mat3.multiply(mat, mat, rotateMat);

  // 取得中心位置
  const centerPoint = project({ x: 0.5 * width, y: 0.5 * height }, mat);

  // 如果是旋转操作
  if (resizeType === 'rotate') {
    const rotateHandlePoint = project({ x: 0.5 * width, y: -30 }, mat);
    const cx = rotateHandlePoint.x + x - centerPoint.x;
    const cy = rotateHandlePoint.y + y - centerPoint.y;
    let newRotate = Math.round(deg(Math.atan2(cx, -cy)));

    if (eqRatio) {
      newRotate = roundBy45(newRotate);
    } else if (roundBy5(newRotate) % 90 === 0) {
      newRotate = roundBy5(newRotate);
    }

    // 绕中心点旋转
    const matAfterRotate = rotateMatrixAroundPoint(mat, centerPoint, rad(newRotate - rotate));
    const changedBounds = getTransformInfo(matAfterRotate);
    return {
      left: changedBounds.x,
      top: changedBounds.y,
      rotate: changedBounds.rotate,
    };
  }

  // 剩下的操作都是调整大小了

  // 根据 resizeType 算出是哪些方位受影响
  const _resizeType = resizeType.toLowerCase();
  const affectTop = _resizeType.includes('top');
  const affectLeft = _resizeType.includes('left');
  const affectRight = _resizeType.includes('right');
  const affectBottom = _resizeType.includes('bottom');
  const affectVertical = affectTop || affectBottom;
  const affectHorizontal = affectLeft || affectRight;

  // 基准点，缩放的基准
  const basePoint: Point = { x: 0, y: 0 };

  // 手柄点位，记录是通过哪个点开始拖拽的
  const handlePoint: Point = { x: 0, y: 0 };

  // 默认情况下，手柄点位刚好和基准点中心对称
  if (affectTop) {
    basePoint.y = startBounds.height;
    handlePoint.y = 0;
  }
  if (affectBottom) {
    basePoint.y = 0;
    handlePoint.y = startBounds.height;
  }
  if (affectLeft) {
    basePoint.x = startBounds.width;
    handlePoint.x = 0;
  }
  if (affectRight) {
    basePoint.x = 0;
    handlePoint.x = startBounds.width;
  }

  if (symmetrical) {
    basePoint.x = 0.5 * width;
    basePoint.y = 0.5 * height;
  }

  // 算出当前鼠标位置的原始位置（即相对未变换时的原点的坐标）
  const p = project(handlePoint, mat);
  const currentPoint = unproject({ x: p.x + x, y: p.y + y }, mat);

  const diffX = currentPoint.x - handlePoint.x;
  const diffY = currentPoint.y - handlePoint.y;

  // 根据鼠标偏移，在不影响最小值的情况下，计算出上下左右的变化范围
  const diffRight = Math.min(width - minSize, diffX);
  const diffLeft = Math.max(minSize - width, diffX);
  const diffBottom = Math.max(minSize - height, diffY);
  const diffTop = Math.min(height - minSize, diffY);

  // 默认情况下新的位置变化（复用于等比缩放）
  let newTop: Partial<Bounds> = { top: diffTop, height: height - diffTop };
  let newBottom: Partial<Bounds> = { top: 0, height: height + diffBottom };
  let newRight: Partial<Bounds> = { left: 0, width: width + diffLeft };
  let newLeft: Partial<Bounds> = { left: diffRight, width: width - diffRight };

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
        newTop = { top: height - hh, height: hh, left: 0.5 * (width - hw), width: hw };
        newBottom = { height: hh, left: 0.5 * (width - hw), width: hw };
        newLeft = {
          left: width - hw,
          width: hw,
          top: 0.5 * (height - hh),
          height: hh,
        };
        newRight = { width: hw, top: 0.5 * (height - hh), height: hh };
      } else {
        newTop = { top: height - hh, height: hh };
        newBottom = { height: hh };
        newLeft = { left: width - hw, width: hw };
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

  let newBounds = { ...startBounds, left: 0, top: 0 };
  // 普通缩放
  switch (resizeType) {
    case 'top':
      /* 上↑ */
      newBounds = { ...newBounds, ...newTop };
      break;
    case 'bottom':
      /* 下↓ */
      newBounds = { ...newBounds, ...newBottom };
      break;
    case 'right':
      /* 右→ */
      newBounds = { ...newBounds, ...newRight };
      break;
    case 'left':
      /* 左← */
      newBounds = { ...newBounds, ...newLeft };
      break;
    case 'topLeft':
      /* 左上↖ */
      newBounds = { ...newBounds, ...newLeft, ...newTop };
      break;
    case 'topRight':
      /* 右上↗ */
      newBounds = { ...newBounds, ...newRight, ...newTop };
      break;
    case 'bottomLeft':
      /* 左下↙ */
      newBounds = { ...newBounds, ...newLeft, ...newBottom };
      break;
    case 'bottomRight':
      /* 右下↘ */
      newBounds = { ...newBounds, ...newRight, ...newBottom };
      break;
    default:
  }

  // 转换起点坐标
  const projectLT = project({ x: newBounds.left, y: newBounds.top }, mat);
  return { ...newBounds, left: projectLT.x, top: projectLT.y };
}

/**
 * 判断 bounds 的中心点是否在 limit 内，如果不是，则生成符合限制的新 bounds
 * @param bounds
 * @param limit
 */
export function calcLimitBounds(bounds: Bounds, limit?: Bounds) {
  const { top, left, width, height, rotate = 0 } = bounds;
  const { top: limitTop = -Infinity, left: limitLeft = -Infinity, width: limitWidth = Infinity, height: limitHeight = Infinity } = limit || {};
  const mat = mat3.create();
  const translateMat = mat3.create();
  mat3.translate(translateMat, translateMat, vec2.fromValues(left, top));
  const rotateMat = mat3.create();
  mat3.rotate(rotateMat, rotateMat, rad(rotate));
  mat3.multiply(mat, mat, translateMat);
  mat3.multiply(mat, mat, rotateMat);

  // 取得中心位置
  const centerPoint = project({ x: 0.5 * width, y: 0.5 * height }, mat);

  const newBounds = { ...bounds };
  let changed = false;
  if (centerPoint.x < limitLeft) {
    newBounds.left += limitLeft - centerPoint.x;
    changed = true;
  }
  if (centerPoint.x > limitLeft + limitWidth) {
    newBounds.left += limitLeft + limitWidth - centerPoint.x;
    changed = true;
  }
  if (centerPoint.y < limitTop) {
    newBounds.top += limitTop - centerPoint.y;
    changed = true;
  }
  if (centerPoint.y > limitTop + limitHeight) {
    newBounds.top += limitTop + limitHeight - centerPoint.y;
    changed = true;
  }
  return changed ? newBounds : bounds;
}

/**
 * 计算 bounds 的变化
 * @param startBounds 原始 bounds
 * @param pointOffset 鼠标偏移
 * @param options
 */
export const calcBoundsChangeBack = (
  startBounds: Bounds,
  _currentPoint: Point,
  pointOffset: Point,
  options: CalcPropsChangeOptions = {},
): Partial<Bounds> => {
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

export const getPointByEvent = (event: PointerEvent | MouseEvent | TouchEvent) => {
  if (event instanceof TouchEvent) {
    return {
      x: event.touches?.[0]?.clientX,
      y: event.touches?.[0]?.clientY,
    };
  }

  return {
    x: event.pageX,
    y: event.pageY,
  };
};

export const getPointOffset = (p1: Point, p2: Point) => ({
  x: p2.x - p1.x,
  y: p2.y - p1.y,
});
