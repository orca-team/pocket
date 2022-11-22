import { useState } from 'react';
import { useEventListener } from 'ahooks';
import { Target } from 'ahooks/lib/useEventListener';

type PositionType = [number, number];

export type UsePanCallbackParams = {
  offset: PositionType;
  finish: boolean;
  start: boolean;
};

export default function usePan<T extends Target = Target>(
  callback: (event: UsePanCallbackParams) => void,
  target: T,
) {
  const [_this] = useState<{
    mousedownPosition?: PositionType;
  }>(() => ({}));
  useEventListener(
    'mousedown',
    (e) => {
      _this.mousedownPosition = [e.clientX, e.clientY];
      callback({
        start: true,
        finish: false,
        offset: [0, 0],
      });
    },
    { target },
  );

  useEventListener('mousemove', (e) => {
    if (_this.mousedownPosition) {
      const offsetX = e.clientX - _this.mousedownPosition[0];
      const offsetY = e.clientY - _this.mousedownPosition[1];
      callback({
        start: false,
        finish: false,
        offset: [offsetX, offsetY],
      });
    }
  });

  useEventListener('mouseup', (e) => {
    if (_this.mousedownPosition) {
      const offsetX = e.clientX - _this.mousedownPosition[0];
      const offsetY = e.clientY - _this.mousedownPosition[1];
      callback({
        start: false,
        finish: true,
        offset: [offsetX, offsetY],
      });
      _this.mousedownPosition = undefined;
    }
  });
}
