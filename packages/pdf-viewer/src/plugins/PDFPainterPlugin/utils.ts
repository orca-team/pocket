import type { Point, ShapeDataType } from '@orca-fe/painter';
import { isGraphShapeType } from '@orca-fe/painter';
import { PixelsPerInch } from '../../utils';

/**
 * 将 GraphShape 的 PDF 坐标转换为 CSS 坐标
 * @param shape
 */
export function shapePdfToCss(shape: ShapeDataType): ShapeDataType {
  if (isGraphShapeType(shape)) {
    const newShape = { ...shape };
    if ('x' in newShape && typeof newShape.x === 'number') {
      newShape.x *= PixelsPerInch.PDF_TO_CSS_UNITS;
    }
    if ('y' in newShape && typeof newShape.y === 'number') {
      newShape.y *= PixelsPerInch.PDF_TO_CSS_UNITS;
    }
    if ('width' in newShape && typeof newShape.width === 'number') {
      newShape.width *= PixelsPerInch.PDF_TO_CSS_UNITS;
    }
    if ('height' in newShape && typeof newShape.height === 'number') {
      newShape.height *= PixelsPerInch.PDF_TO_CSS_UNITS;
    }
    if ('point1' in newShape && Array.isArray(newShape.point1)) {
      newShape.point1 = newShape.point1.map(v => v * PixelsPerInch.PDF_TO_CSS_UNITS) as Point;
    }
    if ('point2' in newShape && Array.isArray(newShape.point2)) {
      newShape.point2 = newShape.point2.map(v => v * PixelsPerInch.PDF_TO_CSS_UNITS) as Point;
    }

    return newShape;
  }
  return shape;
}

/**
 * 将 GraphShape 的 CSS 坐标转换为 PDF 坐标
 * @param shape
 */
export function shapeCssToPdf(shape: ShapeDataType): ShapeDataType {
  if (isGraphShapeType(shape)) {
    const newShape = { ...shape };
    if ('x' in newShape && typeof newShape.x === 'number') {
      newShape.x /= PixelsPerInch.PDF_TO_CSS_UNITS;
    }
    if ('y' in newShape && typeof newShape.y === 'number') {
      newShape.y /= PixelsPerInch.PDF_TO_CSS_UNITS;
    }
    if ('width' in newShape && typeof newShape.width === 'number') {
      newShape.width /= PixelsPerInch.PDF_TO_CSS_UNITS;
    }
    if ('height' in newShape && typeof newShape.height === 'number') {
      newShape.height /= PixelsPerInch.PDF_TO_CSS_UNITS;
    }
    if ('point1' in newShape && Array.isArray(newShape.point1)) {
      newShape.point1 = newShape.point1.map(v => v / PixelsPerInch.PDF_TO_CSS_UNITS) as Point;
    }
    if ('point2' in newShape && Array.isArray(newShape.point2)) {
      newShape.point2 = newShape.point2.map(v => v / PixelsPerInch.PDF_TO_CSS_UNITS) as Point;
    }

    return newShape;
  }
  return shape;
}
