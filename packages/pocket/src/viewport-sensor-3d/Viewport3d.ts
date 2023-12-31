import { mat4, vec3 } from 'gl-matrix';
import { roundBy } from '@orca-fe/tools';

const round01 = roundBy(0.1);
const round001 = roundBy(0.01);

function rad2deg(rad: number) {
  return (rad * 180) / Math.PI;
}

function deg2rad(deg: number) {
  return (deg * Math.PI) / 180;
}

export type Viewport3dType = {
  left: number;
  top: number;
  zoom: number;
  rotate: number;
  pitch: number;
};

export function matrix2Viewport3d(matrix: mat4) {
  const scale = Math.hypot(matrix[0], matrix[1]);
  const viewport: Viewport3dType = {
    left: round01(matrix[12]),
    top: round01(matrix[13]),
    zoom: round001(Math.log2(scale)),
    rotate: round01(rad2deg(Math.atan2(matrix[1], matrix[0]))),
    pitch: rad2deg(Math.atan2(matrix[6], matrix[10])),
  };
  return viewport;
}

export default class Viewport3d {
  left: number;
  top: number;
  zoom: number;
  rotate: number;
  pitch: number;

  constructor(props: Partial<Viewport3d> = {}) {
    const { left = 0, top = 0, zoom = 0, rotate = 0, pitch = 0 } = props;
    this.left = left;
    this.top = top;
    this.zoom = zoom;
    this.rotate = rotate;
    this.pitch = pitch;
  }

  setViewport(viewport: Partial<Viewport3dType>) {
    const { left, top, zoom, rotate, pitch } = viewport;
    if (left != null) this.left = left;
    if (top != null) this.top = top;
    if (zoom != null) this.zoom = zoom;
    if (rotate != null) this.rotate = rotate;
    if (pitch != null) this.pitch = pitch;
    return this;
  }

  getViewport(): Viewport3dType {
    return {
      left: this.left,
      top: this.top,
      zoom: this.zoom,
      rotate: this.rotate,
      pitch: this.pitch,
    };
  }

  // 将 Viewport3d 转换为 mat4
  toMatrix() {
    const matrix = mat4.create();
    mat4.translate(matrix, matrix, [this.left, this.top, 0]);
    mat4.scale(matrix, matrix, [2 ** this.zoom, 2 ** this.zoom, 1]);
    mat4.rotateZ(matrix, matrix, deg2rad(this.rotate));
    mat4.rotateX(matrix, matrix, deg2rad(this.pitch));
    return matrix;
  }

  // 将 mat4 转换为 Viewport3d
  fromMatrix(matrix: mat4) {
    const viewport = matrix2Viewport3d(matrix);
    this.left = viewport.left;
    this.top = viewport.top;
    this.zoom = viewport.zoom;
    this.rotate = viewport.rotate;
    this.pitch = viewport.pitch;
    return this;
  }

  toInverseMatrix() {
    const matrix = this.toMatrix();
    const inverseMatrix = mat4.create();
    mat4.invert(inverseMatrix, matrix);
    return inverseMatrix;
  }

  /**
   * world -> screen
   */
  project(point: [number, number]): [number, number] {
    const [x, y] = point;
    const result = vec3.create();
    vec3.transformMat4(result, vec3.fromValues(x, y, 0), this.toMatrix());
    const [left, top] = [result[0], result[1]];
    return [left, top];
  }

  /**
   * screen -> world
   */
  unproject(point: [number, number]): [number, number] {
    const [left, top] = point;
    const result = vec3.create();
    vec3.transformMat4(result, [left, top, 0], this.toInverseMatrix());
    const [x, y] = [result[0], result[1]];
    return [x, y];
  }

  /**
   * 将世界坐标点对齐至屏幕坐标点（平移）并返回新的 Viewport
   * @param originWorldPoint 原始世界坐标点
   * @param screenPoint 屏幕坐标点
   */
  getViewportByScreenPoint(originWorldPoint: [number, number], screenPoint: [number, number]) {
    // 计算原始坐标点映射在屏幕的位置
    const originScreenPoint = this.project(originWorldPoint);

    // 计算屏幕偏移量
    const offset = vec3.create();
    const originScreenVec3 = vec3.fromValues(originScreenPoint[0], originScreenPoint[1], 0);
    const targetScreenVec3 = vec3.fromValues(screenPoint[0], screenPoint[1], 0);
    vec3.sub(offset, targetScreenVec3, originScreenVec3);
    // 得出偏移后的矩阵
    const matTranslate = mat4.create();
    mat4.translate(matTranslate, matTranslate, offset);
    const matrix = this.toMatrix();
    mat4.multiply(matrix, matTranslate, matrix);
    return matrix2Viewport3d(matrix);
  }

  /**
   * 根据屏幕点和缩放级别计算 Viewport
   * @param screenPoint
   * @param zoom
   */
  getViewportByZoom(screenPoint: [number, number], zoom: number) {
    // 计算当前屏幕点映射的世界坐标点
    const worldPoint = this.unproject(screenPoint);
    const viewport3d = new Viewport3d({
      ...this.getViewport(),
      zoom,
    });
    const vp = viewport3d.pan(worldPoint, screenPoint).getViewport();
    return vp;
  }

  getViewportByRotate(screenPoint: [number, number], deg: number) {
    const matrix = this.toMatrix();

    // 创建旋转矩阵
    const matrixRotation = mat4.create();
    mat4.translate(matrixRotation, matrixRotation, [screenPoint[0], screenPoint[1], 0]);
    mat4.rotateZ(matrixRotation, matrixRotation, deg2rad(deg));
    mat4.translate(matrixRotation, matrixRotation, [-screenPoint[0], -screenPoint[1], 0]);

    // 计算旋转后的矩阵
    mat4.multiply(matrix, matrixRotation, matrix);
    return matrix2Viewport3d(matrix);
  }

  pan(originWorldPoint: [number, number], screenPoint: [number, number]) {
    const newViewport = this.getViewportByScreenPoint(originWorldPoint, screenPoint);
    // 更新 Viewport
    this.setViewport(newViewport);
    return this;
  }

  zoomBy(screenPoint: [number, number], zoom: number) {
    const newViewport = this.getViewportByZoom(screenPoint, zoom);
    // 更新 Viewport
    this.setViewport(newViewport);
    return this;
  }
}
