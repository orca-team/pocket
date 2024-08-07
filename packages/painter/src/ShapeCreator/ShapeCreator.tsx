import React, { useRef, useState } from 'react';
import { usePan } from '@orca-fe/hooks';
import useStyle from './ShapeCreator.style';
import type { GraphShapeType, ShapeType } from '../def';
import { simplify } from '../pathSimplify';

const ef = () => {};

export interface ShapeCreatorProps extends React.HTMLAttributes<HTMLDivElement> {
  shapeType?: ShapeType;
  onDrawing?: (shape: GraphShapeType) => void;
  onCreate?: (shape: GraphShapeType) => void;
  onCancel?: () => void;
  pointMapping?: (point: { x: number; y: number }) => { x: number; y: number };
  graphMarkList?: GraphShapeType[];
  maxMarkNum?: number;
}

const ShapeCreator = (props: ShapeCreatorProps) => {
  const { className = '', shapeType = 'line', onCreate = ef, onDrawing = ef, onCancel = ef, pointMapping = a => a, maxMarkNum = 0, ...otherProps } = props;
  const styles = useStyle();

  const rootRef = useRef<HTMLDivElement>(null);

  const [_this] = useState<{
    data?: GraphShapeType;
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
        _this.data = { type: 'line', point1: [x1, y1], point2: [x2, y2] };
        break;
      // eslint-disable-next-line no-fallthrough
      case 'ellipse':
        _this.data = {
          type: 'ellipse',
          x,
          y,
          width,
          height,
          rotate: 0,
        };
        break;
        case 'rectangle':
          _this.data = { type: 'rectangle', x, y, width, height, rotate: 0 };
        break;
      case 'mark':
        _this.data = { type: 'mark', x, y, width, height, rotate: 0, markNum: maxMarkNum + 1 };
        break;
      case 'line-path':
        // 折线
        _this.data = {
          type: 'line-path',
          x,
          y,
          width,
          height,
          points: [...(_this.data?.['points'] ?? []), [x2, y2]],
          rotate: 0,
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
        // 根据绘图的信息，优化 bounds
        let left = Infinity;
        let top = Infinity;
        let right = -Infinity;
        let bottom = -Infinity;
        _this.data.points.forEach(([x, y]) => {
          // 找到最大最小值
          left = Math.min(left, x);
          top = Math.min(top, y);
          right = Math.max(right, x);
          bottom = Math.max(bottom, y);
        });
        _this.data.x = left;
        _this.data.y = top;
        _this.data.width = right - left;
        _this.data.height = bottom - top;
      }
      onCreate(_this.data);
      _this.data = undefined;
    } else {
      onDrawing(_this.data);
    }
  }, rootRef);

  return <div ref={rootRef} className={`${styles.root} ${className}`} {...otherProps} />;
};

export default ShapeCreator;
