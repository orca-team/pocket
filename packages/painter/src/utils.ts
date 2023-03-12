import Konva from 'konva';
import type { ShapeDataType, ShapeType } from './def';

export function normalizeShape(shape: Konva.Shape) {
  const transform = shape.getTransform();
  const decompose = transform.decompose();
  const { scaleX, scaleY } = decompose;
  if (shape instanceof Konva.Rect) {
    const { width, height } = shape.attrs;
    shape.setAttrs({
      width: width * scaleX,
      height: height * scaleY,
      scaleX: 1,
      scaleY: 1,
    });
  } else if (shape instanceof Konva.Ellipse) {
    const { radiusX, radiusY } = shape.attrs;
    shape.setAttrs({
      radiusX: radiusX * scaleX,
      radiusY: radiusY * scaleY,
      scaleX: 1,
      scaleY: 1,
    });
  } else if (shape instanceof Konva.Line) {
    const { points } = shape.attrs;

    const newPoints: number[] = [];
    for (let i = 0; i < points.length; i += 2) {
      const p = transform.point({
        x: points[i],
        y: points[i + 1],
      });
      newPoints.push(p.x, p.y);
    }

    shape.setAttrs({
      points: newPoints,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      rotation: 0,
      skewX: 0,
      skewY: 0,
    });
  }
}

function checkShapeType(shape: Konva.Shape, type: ShapeType) {
  switch (type) {
    case 'rectangle':
      return shape instanceof Konva.Rect;
    case 'ellipse':
      return shape instanceof Konva.Ellipse;
    case 'line':
    case 'line-path':
      return shape instanceof Konva.Line;
  }
  return false;
}

export function createShape(shapeData: ShapeDataType) {
  switch (shapeData.type) {
    case 'rectangle':
      return new Konva.Rect({
        x: shapeData.x,
        y: shapeData.y,
        width: shapeData.width,
        height: shapeData.height,
        stroke: '#000',
      });
    case 'ellipse':
      return new Konva.Ellipse({
        x: shapeData.x,
        y: shapeData.y,
        radiusX: shapeData.radiusX,
        radiusY: shapeData.radiusY,
        stroke: '#000',
      });
    case 'line':
    case 'line-path':
      return new Konva.Line({
        points: shapeData.points,
        stroke: '#000',
      });
    default:
  }
  throw new Error(`invalid shape type: '${shapeData['type']}'`);
}

export function createOrUpdateShape(
  shapeData: ShapeDataType,
  shape?: Konva.Shape,
) {
  if (shape && checkShapeType(shape, shapeData.type)) {
    // 检查 shape 类型是否和数据类型一致
    const { type, ...attrs } = shapeData;
    shape.setAttrs(attrs);
    return undefined;
  }
  return createShape(shapeData);
}
