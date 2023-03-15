import React, { useRef, useState } from 'react';
import { usePan } from '@orca-fe/hooks';
import useStyle from './ShapeCreator.style';
import type { ShapeDataType, ShapeType } from '../def';
import { simplify } from '../pathSimplify';

const ef = () => {};

export interface ShapeCreatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  shapeType?: ShapeType;
  onDrawing?: (shape: ShapeDataType) => void;
  onCreate?: (shape: ShapeDataType) => void;
  onCancel?: () => void;
  pointMapping?: (point: { x: number; y: number }) => { x: number; y: number };
}

const ShapeCreator = (props: ShapeCreatorProps) => {
  const {
    className = '',
    shapeType = 'line',
    onCreate = ef,
    onDrawing = ef,
    onCancel = ef,
    pointMapping = (a) => a,
    ...otherProps
  } = props;
  const styles = useStyle();

  const rootRef = useRef<HTMLDivElement>(null);

  const [_this] = useState<{
    data?: ShapeDataType;
  }>({});

  usePan(({ ev, startPosition, offset, start, finish }) => {
    if (start) {
      _this.data = undefined;
    }
    const { x: x1, y: y1 } = pointMapping({
      x: startPosition[0],
      y: startPosition[1],
    });
    const { x: x2, y: y2 } = pointMapping({
      x: startPosition[0] + offset[0],
      y: startPosition[1] + offset[1],
    });
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const width = Math.abs(x1 - x2);
    const height = Math.abs(y1 - y2);

    switch (shapeType) {
      case 'line':
        _this.data = { type: 'line', points: [x1, y1, x2, y2] };
        break;
      // eslint-disable-next-line no-fallthrough
      case 'ellipse':
        _this.data = {
          type: 'ellipse',
          x: x + 0.5 * width,
          y: y + 0.5 * height,
          radiusX: 0.5 * width,
          radiusY: 0.5 * height,
        };
        break;
      case 'rectangle':
        _this.data = { type: 'rectangle', x, y, width, height };
        break;
      case 'line-path':
        // 折线
        _this.data = {
          type: 'line-path',
          points: [...(_this.data?.['points'] ?? []), x2, y2],
        };
        break;
      default:
        // 其他类型，不能通过 usePan 处理
        return;
    }
    if (finish) {
      // 如果距离太近，则取消
      if (offset[0] ** 2 + offset[1] ** 2 < 4) {
        onCancel();
        _this.data = undefined;
        return;
      }
      if (_this.data.type === 'line-path') {
        // 简化自由绘图
        _this.data.points = simplify(_this.data.points);
      }
      onCreate(_this.data);
      _this.data = undefined;
    } else {
      onDrawing(_this.data);
    }
  }, rootRef);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className}`}
      {...otherProps}
    />
  );
};

export default ShapeCreator;
