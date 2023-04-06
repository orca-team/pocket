export type TooltipDataType = {
  type: 'tooltip';
  pointX: number;
  pointY: number;
  x: number;
  y: number;
  width: number;
  value: string;
  color?: string;
  fontSize?: number;
  disabled?: boolean;
};
