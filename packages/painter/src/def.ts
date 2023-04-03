export type ShapeType = 'line' | 'ellipse' | 'rectangle' | 'line-path' | 'image' | string;

export type Point = [number, number];

export type StrokeStyle = {
  stroke?: string;
  strokeWidth?: number;
};

export type LineShapeType = StrokeStyle & {
  type: 'line';
  point1: Point;
  point2: Point;
};

export type EllipseType = StrokeStyle & {
  type: 'ellipse';
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

export type RectangleType = StrokeStyle & {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

export type LinePathType = StrokeStyle & {
  type: 'line-path';
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  points: Point[];
};

export type ImageType = {
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  src: string;
};

export type GraphShapeType = LineShapeType | EllipseType | RectangleType | LinePathType;

export type ShapeDataType = GraphShapeType | ImageType;

export function isGraphShapeType(shape: ShapeDataType): shape is GraphShapeType {
  return shape.type !== 'image';
}

export function isImageType(shape: ShapeDataType): shape is ImageType {
  return shape.type === 'image';
}
