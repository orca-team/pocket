export type ShapeType = 'line' | 'ellipse' | 'rectangle' | 'line-path' | 'image' | string;

export type Point = [number, number];

export type StrokeStyle = {
  stroke?: string;
  strokeWidth?: number;
};

export type CommonShapeType = {
  disabled?: boolean;
};

export type LineShapeType = StrokeStyle &
  CommonShapeType & {
    type: 'line';
    point1: Point;
    point2: Point;
  };

export type EllipseType = StrokeStyle &
  CommonShapeType & {
    type: 'ellipse';
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number;
  };

export type MarkType = StrokeStyle &
  CommonShapeType & {
    type: 'mark';
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number;
    markNum: number;
  };

export type RectangleType = StrokeStyle &
  CommonShapeType & {
    type: 'rectangle';
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number;
  };

export type LinePathType = StrokeStyle &
  CommonShapeType & {
    type: 'line-path';
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number;
    points: Point[];
  };

export type ImageType = CommonShapeType & {
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  src: string;
};

export type GraphShapeType = LineShapeType | EllipseType | RectangleType | LinePathType | MarkType;

export type ShapeDataType = GraphShapeType | ImageType;

export function isGraphShapeType(shape: ShapeDataType): shape is GraphShapeType {
  return shape.type !== 'image';
}

export function isImageType(shape: ShapeDataType): shape is ImageType {
  return shape.type === 'image';
}
