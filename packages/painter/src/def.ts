export type ShapeType = 'line' | 'ellipse' | 'rectangle';

export type LineShapeType = {
  type: 'line';
  points: [number, number, number, number];
};

export type EllipseType = {
  type: 'ellipse';
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
};

export type RectangleType = {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ShapeDataType = LineShapeType | EllipseType | RectangleType;
