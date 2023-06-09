import React, { useRef, useState } from 'react';
import { usePan } from '@orca-fe/hooks';
import useStyle from './TooltipCreator.style';
import type { TooltipDataType } from '../def';
import { useLocale } from '../../../locale/context';
import zhCN from '../../../locale/zh_CN';

const ef = () => {};

export interface ShapeCreatorProps extends React.HTMLAttributes<HTMLDivElement> {
  onDrawing?: (shape: TooltipDataType) => void;
  onCreate?: (shape: TooltipDataType) => void;
  onCancel?: () => void;
  pointMapping?: (point: { x: number; y: number }) => { x: number; y: number };
  initialAttr?: Omit<Partial<TooltipDataType>, 'type'>;
}

const TooltipCreator = (props: ShapeCreatorProps) => {
  const { className = '', onCreate = ef, onDrawing = ef, onCancel, pointMapping = a => a, initialAttr = {}, ...otherProps } = props;
  const styles = useStyle();

  const [l] = useLocale(zhCN);

  const rootRef = useRef<HTMLDivElement>(null);

  const [_this] = useState<{
    data?: TooltipDataType;
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
    _this.data = {
      width: 160,
      x: x2 + 16,
      y: y2 - 16,
      pointX: x1,
      pointY: y1,
      value: l.inputPlaceHolder || '请输入内容',
      ...initialAttr,
      type: 'tooltip',
    };

    if (finish) {
      onCreate(_this.data);
      _this.data = undefined;
    } else {
      onDrawing(_this.data);
    }
  }, rootRef);

  return <div ref={rootRef} className={`${styles.root} ${className}`} {...otherProps} />;
};

export default TooltipCreator;
