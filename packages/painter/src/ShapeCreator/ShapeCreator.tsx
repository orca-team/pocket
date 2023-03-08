import React, { useRef } from 'react';
import { usePan } from '@orca-fe/hooks';
import useStyle from './ShapeCreator.style';
import type { ShapeDataType, ShapeType } from '../def';

const ef = () => {};

export interface ShapeCreatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  shapeType?: ShapeType;
  onDrawing?: (shape: ShapeDataType) => void;
  onCreate?: (shape: ShapeDataType) => void;
}

const ShapeCreator = (props: ShapeCreatorProps) => {
  const {
    className = '',
    shapeType = 'line',
    onCreate = ef,
    onDrawing = ef,
    ...otherProps
  } = props;
  const styles = useStyle();

  const rootRef = useRef<HTMLDivElement>(null);

  usePan(({ ev, startPosition, offset, start, finish }) => {
    let data: ShapeDataType;
    const x1 = startPosition[0];
    const y1 = startPosition[1];
    const x2 = startPosition[0] + offset[0];
    const y2 = startPosition[1] + offset[1];
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const width = Math.abs(x1 - x2);
    const height = Math.abs(y1 - y2);

    switch (shapeType) {
      case 'line':
        data = { type: 'line', points: [x1, y1, x2, y2] };
        break;
      // eslint-disable-next-line no-fallthrough
      case 'ellipse':
        data = {
          type: 'ellipse',
          x: x + 0.5 * width,
          y: y + 0.5 * height,
          radiusX: 0.5 * width,
          radiusY: 0.5 * height,
        };
        break;
      case 'rectangle':
        data = { type: 'rectangle', x, y, width, height };
        break;
    }
    if (finish) {
      onCreate(data);
    } else {
      onDrawing(data);
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
