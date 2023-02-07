import type React from 'react';
import { useRef, useState } from 'react';
import { useEventListener } from 'ahooks';
import { useEffectWithTarget } from '@orca-fe/hooks';

const ef = () => {};

export type UseDraggableOptions = {
  /** 默认位置 x */
  defaultX?: number;

  /** 默认位置 y */
  defaultY?: number;

  /** 拖拽对象 ref */
  ref?: React.RefObject<HTMLDivElement>;

  /** 使用自定义拖拽手柄 */
  customHandler?: boolean;

  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export default function useDraggable(options: UseDraggableOptions = {}) {
  const {
    defaultY = 0,
    defaultX = 0,
    customHandler,
    ref: refFromOptions,
    onDragEnd = ef,
    onDragStart = ef,
  } = options;
  const _ref = useRef<HTMLDivElement>(null);
  const ref = refFromOptions ?? _ref;
  let dragHandlerRef = useRef<HTMLDivElement>(null);
  if (!customHandler) {
    dragHandlerRef = ref;
  }

  const [_this] = useState<{
    mouse: null | [number, number];
    startMouse: null | [number, number];
    position: null | [number, number];
    startPosition: null | [number, number];
  }>(() => ({
    mouse: null,
    startMouse: null,
    position: [defaultX, defaultY],
    startPosition: null,
  }));

  // 拖拽开始
  useEventListener(
    'dragstart',
    (e) => {
      e.preventDefault();
      _this.startMouse = _this.mouse;
      _this.startPosition = _this.position;
      onDragStart();
    },
    { target: dragHandlerRef },
  );

  useEventListener('mousemove', (e) => {
    _this.mouse = [e.clientX, e.clientY];
    if (_this.startMouse && ref.current && _this.startPosition) {
      const position: typeof _this.position = [
        _this.startPosition[0] + _this.mouse[0] - _this.startMouse[0],
        _this.startPosition[1] + _this.mouse[1] - _this.startMouse[1],
      ];
      _this.position = position;
      ref.current.style.transform = `translate(${position[0]}px, ${position[1]}px)`;
    }
  });

  useEventListener('mouseup', () => {
    if (_this.startMouse) {
      _this.startPosition = null;
      _this.startMouse = null;
      if (_this.position && ref.current && _this.position[1] < 0) {
        _this.position[1] = 0;
        ref.current.style.transform = `translate(${_this.position[0]}px, ${_this.position[1]}px)`;
      }
      onDragEnd();
    }
  });

  useEffectWithTarget(
    () => {
      if (ref.current && _this.position) {
        ref.current.style.transform = `translate(${_this.position[0]}px, ${_this.position[1]}px)`;
      }
    },
    [],
    ref,
  );

  const props = {
    rootProps: {
      ref,
      draggable: !customHandler,
    },
    handleProps: {
      ref: dragHandlerRef,
      draggable: !!customHandler,
    },
  };

  return [props] as [typeof props];
}
