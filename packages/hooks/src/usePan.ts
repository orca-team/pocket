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
  target: HTMLElement;
};

export default function usePan<T extends Target = Target>(
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  callback: (event: UsePanCallbackParams) => boolean | void,
  target: T,
) {
  const [_this] = useState<{
    mousedownPosition?: PositionType;
    target?: HTMLElement;
    triggerTarget?: HTMLElement;
  }>(() => ({}));
  useEventListener(
    'mousedown',
    (e) => {
      _this.mousedownPosition = [e.clientX, e.clientY];
      _this.target = e.currentTarget as HTMLElement;
      _this.triggerTarget = e.target as HTMLElement;
      const { left, top } = _this.target.getBoundingClientRect();
      const res = callback({
        start: true,
        finish: false,
        startPosition: [
          _this.mousedownPosition[0] - left,
          _this.mousedownPosition[1] - top,
        ],
        offset: [0, 0],
        ev: e,
        target: _this.triggerTarget,
      });
      if (res === false) {
        _this.mousedownPosition = undefined;
        _this.target = undefined;
        _this.triggerTarget = undefined;
      }
    },
    { target },
  );

  useEventListener('mousemove', (e) => {
    if (_this.mousedownPosition && _this.target && _this.triggerTarget) {
      const offsetX = e.clientX - _this.mousedownPosition[0];
      const offsetY = e.clientY - _this.mousedownPosition[1];
      const { left, top } = _this.target.getBoundingClientRect();
      const res = callback({
        start: false,
        finish: false,
        startPosition: [
          _this.mousedownPosition[0] - left,
          _this.mousedownPosition[1] - top,
        ],
        offset: [offsetX, offsetY],
        ev: e,
        target: _this.triggerTarget,
      });
      if (res === false) {
        _this.mousedownPosition = undefined;
        _this.target = undefined;
        _this.triggerTarget = undefined;
      }
    }
  });

  useEventListener('mouseup', (e) => {
    if (_this.mousedownPosition && _this.target && _this.triggerTarget) {
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
        target: _this.triggerTarget,
      });
      _this.mousedownPosition = undefined;
    }
  });
}
