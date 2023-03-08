import { useState } from 'react';
import { useEventListener } from 'ahooks';
import type { Target } from 'ahooks/lib/useEventListener';

type PositionType = [number, number];

export type UsePanCallbackParams = {
  startPosition: PositionType;
  offset: PositionType;
  finish: boolean;
  start: boolean;
  ev: MouseEvent;
};

export default function usePan<T extends Target = Target>(
  callback: (event: UsePanCallbackParams) => void,
  target: T,
) {
  const [_this] = useState<{
    mousedownPosition?: PositionType;
    target?: HTMLElement;
  }>(() => ({}));
  useEventListener(
    'mousedown',
    (e) => {
      _this.mousedownPosition = [e.clientX, e.clientY];
      _this.target = e.currentTarget as HTMLElement;
      const { left, top } = _this.target.getBoundingClientRect();
      callback({
        start: true,
        finish: false,
        startPosition: [
          _this.mousedownPosition[0] - left,
          _this.mousedownPosition[1] - top,
        ],
        offset: [0, 0],
        ev: e,
      });
    },
    { target },
  );

  useEventListener('mousemove', (e) => {
    if (_this.mousedownPosition && _this.target) {
      const offsetX = e.clientX - _this.mousedownPosition[0];
      const offsetY = e.clientY - _this.mousedownPosition[1];
      const { left, top } = _this.target.getBoundingClientRect();
      callback({
        start: false,
        finish: false,
        startPosition: [
          _this.mousedownPosition[0] - left,
          _this.mousedownPosition[1] - top,
        ],
        offset: [offsetX, offsetY],
        ev: e,
      });
    }
  });

  useEventListener('mouseup', (e) => {
    if (_this.mousedownPosition && _this.target) {
      const offsetX = e.clientX - _this.mousedownPosition[0];
      const offsetY = e.clientY - _this.mousedownPosition[1];
      const { left, top } = _this.target.getBoundingClientRect();
      callback({
        start: false,
        finish: true,
        startPosition: [
          _this.mousedownPosition[0] - left,
          _this.mousedownPosition[1] - top,
        ],
        offset: [offsetX, offsetY],
        ev: e,
      });
      _this.mousedownPosition = undefined;
    }
  });
}
