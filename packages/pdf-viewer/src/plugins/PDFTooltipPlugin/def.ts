import type React from 'react';

export type TooltipDataType = {
  type: 'tooltip';
  pointX: number;
  pointY: number;
  x: number;
  y: number;
  width: number;
  value: string;
  style?: React.CSSProperties;
};
