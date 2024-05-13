import { useState } from 'react';
import { useEventListener } from 'ahooks';
import type { Target } from 'ahooks/lib/useEventListener';

type PositionType = [number, number];

export type UsePanCallbackParams = {

  /** 拖动事件的起始位置 */
  startPosition: PositionType;

  /** 拖动事件的偏移量 */
  offset: PositionType;

  /** 是否结束（鼠标抬起） */
  finish: boolean;

  /** 是否开始（鼠标按下） */
  start: boolean;

  /** 触发拖动事件的鼠标事件 */
  ev: MouseEvent | TouchEvent;

  /** 触发拖动事件的 HTML 元素 */
  target: HTMLElement;

  /** 触发拖动事件的 HTML 元素的边界 */
  bounds: DOMRect;
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
      const bounds = _this.target.getBoundingClientRect();
      const { left, top } = bounds;
      const res = callback({
        start: true,
        finish: false,
        startPosition: [_this.mousedownPosition[0] - left, _this.mousedownPosition[1] - top],
        offset: [0, 0],
        ev: e,
        target: _this.triggerTarget,
        bounds,
      });
      if (res === false) {
        _this.mousedownPosition = undefined;
        _this.target = undefined;
        _this.triggerTarget = undefined;
      }
    },
    { target },
  );

  useEventListener(
    'touchstart',
    (e) => {
      e.preventDefault(); // 阻止默认的触摸行为，如页面滚动
      _this.mousedownPosition = [e.touches[0].clientX, e.touches[0].clientY];
      _this.target = e.currentTarget as HTMLElement;
      _this.triggerTarget = e.target as HTMLElement;
      const bounds = _this.target.getBoundingClientRect();
      const { left, top } = bounds;
      const res = callback({
        start: true,
        finish: false,
        startPosition: [_this.mousedownPosition[0] - left, _this.mousedownPosition[1] - top],
        offset: [0, 0],
        ev: e,
        target: _this.triggerTarget,
        bounds,
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
      const bounds = _this.target.getBoundingClientRect();
      const { left, top } = bounds;
      const res = callback({
        start: false,
        finish: false,
        startPosition: [_this.mousedownPosition[0] - left, _this.mousedownPosition[1] - top],
        offset: [offsetX, offsetY],
        ev: e,
        target: _this.triggerTarget,
        bounds,
      });
      if (res === false) {
        _this.mousedownPosition = undefined;
        _this.target = undefined;
        _this.triggerTarget = undefined;
      }
    }
  });

  useEventListener(
    'touchmove',
    (e) => {
      if (_this.mousedownPosition && _this.target && _this.triggerTarget) {
        const offsetX = e.touches[0].clientX - _this.mousedownPosition[0];
        const offsetY = e.touches[0].clientY - _this.mousedownPosition[1];
        const bounds = _this.target.getBoundingClientRect();
        const { left, top } = bounds;
        const res = callback({
          start: false,
          finish: false,
          startPosition: [_this.mousedownPosition[0] - left, _this.mousedownPosition[1] - top],
          offset: [offsetX, offsetY],
          ev: e,
          target: _this.triggerTarget,
          bounds,
        });
        if (res === false) {
          _this.mousedownPosition = undefined;
          _this.target = undefined;
          _this.triggerTarget = undefined;
        }
      }
    },
    { passive: false }, // 对于 touchmove，阻止默认的 passive 模式，以允许阻止滚动
  );

  useEventListener('mouseup', (e) => {
    if (_this.mousedownPosition && _this.target && _this.triggerTarget) {
      const offsetX = e.clientX - _this.mousedownPosition[0];
      const offsetY = e.clientY - _this.mousedownPosition[1];
      const bounds = _this.target.getBoundingClientRect();
      const { left, top } = bounds;
      callback({
        start: false,
        finish: true,
        startPosition: [_this.mousedownPosition[0] - left, _this.mousedownPosition[1] - top],
        offset: [offsetX, offsetY],
        ev: e,
        target: _this.triggerTarget,
        bounds,
      });
      _this.mousedownPosition = undefined;
    }
  });

  useEventListener(
    'touchend',
    (e) => {
      if (_this.mousedownPosition && _this.target && _this.triggerTarget) {
        const offsetX = e.changedTouches[0].clientX - _this.mousedownPosition[0];
        const offsetY = e.changedTouches[0].clientY - _this.mousedownPosition[1];
        const bounds = _this.target.getBoundingClientRect();
        const { left, top } = bounds;
        callback({
          start: false,
          finish: true,
          startPosition: [_this.mousedownPosition[0] - left, _this.mousedownPosition[1] - top],
          offset: [offsetX, offsetY],
          ev: e,
          target: _this.triggerTarget,
          bounds,
        });
        _this.mousedownPosition = undefined;
      }
    },
    { target },
  );
}
