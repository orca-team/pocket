import React, { useRef, useState } from 'react';
import cn from 'classnames';
import { useControllableValue, useDebounceFn, useEventListener, useMemoizedFn } from 'ahooks';
import { usePan } from '@orca-fe/hooks';
import useStyles from './TransformerBox.style';
import type { Bounds, Point, ResizeType } from './utils';
import { calcBoundsChange, getPointByEvent, getPointOffset, getResizeMode } from './utils';

const ef = () => {};

export type TransformType = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
};

export interface TransformerBoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  disabled?: boolean;
  checked?: boolean;
  minDragDistance?: number;
  defaultBounds?: Bounds;
  bounds?: Bounds;
  onChangeStart?: (e: Event, type: ResizeType) => void;
  onDragBefore?: (e: MouseEvent) => boolean;
  onBoundsChange?: (bounds: Bounds) => void;
  onChangeEnd?: () => void;
  onClickFixed?: (e: MouseEvent) => void;
}

const TransformerBox = (props: TransformerBoxProps) => {
  const {
    className = '',
    children,
    bounds: nouse,
    onBoundsChange,
    defaultBounds,
    disabled,
    minDragDistance = 4,
    onDragBefore = ef,
    onChangeEnd = ef,
    onChangeStart = ef,
    onClickFixed = ef,
    checked,
    style,
    ...otherProps
  } = props;
  const styles = useStyles();

  const [_this] = useState({
    distanceLock: false,
    // 鼠标按下时的Bounds信息，也用于表达鼠标按下状态
    pointerDownBounds: false as false | Bounds,
    // 鼠标按下时的鼠标坐标
    pointerDownPosition: { x: 0, y: 0 } as Point,
    currentPoint: { x: 0, y: 0 } as Point,
    resizeType: undefined as ResizeType | undefined,
    lastClickTime: 0,
    ctrlDown: false,
    shiftDown: false,
  });

  const [bounds, _setBounds] = useControllableValue<Bounds>(props, {
    defaultValuePropName: 'defaultBounds',
    valuePropName: 'bounds',
    trigger: 'onBoundsChange',
  });

  const { left: _left, top: _top, width: _width, height: _height } = bounds;

  const setBounds = useMemoizedFn((param: React.SetStateAction<Partial<Bounds>>) => {
    _setBounds((bounds) => {
      const newBounds = typeof param === 'function' ? param(bounds) : param;
      return {
        ...bounds,
        ...newBounds,
      };
    });
  });

  const changeBounds = useMemoizedFn(() => {
    if (!(_this.pointerDownBounds && _this.resizeType)) return;
    const pointOffset = getPointOffset(_this.pointerDownPosition, _this.currentPoint);
    if (!_this.distanceLock || minDragDistance ** 2 < pointOffset.x ** 2 + pointOffset.y ** 2) {
      /* 解锁距离锁 */
      _this.distanceLock = false;
      const changedState = calcBoundsChange(
        _this.pointerDownBounds,
        {
          x: Math.round(pointOffset.x / 1),
          y: Math.round(pointOffset.y / 1),
        },
        {
          resizeType: _this.resizeType,
          eqRatio: _this.shiftDown,
          symmetrical: _this.ctrlDown,
        },
      );
      setBounds({
        ...changedState,
      });
    }
  });

  useEventListener('keydown', (e) => {
    if (!_this.ctrlDown && (e.key === 'Control' || e.key === 'Meta')) {
      _this.ctrlDown = true;
      changeBounds();
    }
    if (!_this.shiftDown && e.key === 'Shift') {
      _this.shiftDown = true;
      changeBounds();
    }
  });
  useEventListener('keyup', (e) => {
    if (e.key === 'Control' || e.key === 'Meta') {
      _this.ctrlDown = false;
      changeBounds();
    }
    if (e.key === 'Shift') {
      _this.shiftDown = false;
      changeBounds();
    }
  });

  const rootRef = useRef<HTMLDivElement>(null);
  usePan(({ target, start, startPosition, ev, offset, finish }) => {
    const currentPoint = getPointByEvent(ev);
    if (start) {
      _this.distanceLock = true;
      if (target instanceof HTMLDivElement) {
        const draggable = onDragBefore(ev);
        if (draggable === false) {
          return false;
        }

        /* 加距离锁 */
        _this.pointerDownPosition = currentPoint;
        _this.currentPoint = _this.pointerDownPosition;
        _this.pointerDownBounds = { ...bounds };
        _this.resizeType = getResizeMode(Array.from(target.classList));
        onChangeStart(ev, _this.resizeType);
      } else {
        return false;
      }
    }

    if (finish) {
      if (_this.pointerDownBounds) {
        _this.pointerDownBounds = false;
        _this.resizeType = undefined;
        onChangeEnd();
      }
      return true;
    }

    if (_this.pointerDownBounds && _this.resizeType) {
      _this.currentPoint = currentPoint;
      changeBounds();
    }

    return true;
  }, rootRef);

  useEventListener(
    'dragstart',
    (event) => {
      event.preventDefault();
    },
    { target: rootRef },
  );

  useEventListener(
    'mouseup',
    (event: MouseEvent) => {
      const diff = Date.now() - _this.lastClickTime;
      _this.lastClickTime = Date.now();
      if (_this.distanceLock && event.button === 0 && diff < 200) {
        onClickFixed(event);
      }
    },
    { target: rootRef },
  );

  const triggerKeyboardChangeEnd = useDebounceFn(
    () => {
      onChangeEnd();
    },
    { wait: 1000 },
  );
  const triggerKeyboardChangeStart = useMemoizedFn((e: Event) => {
    onChangeStart(e, 'keyboard');
    triggerKeyboardChangeEnd.run();
  });

  useEventListener('keydown', (e) => {
    if (_this.pointerDownBounds) return;
    if (checked && !disabled) {
      const { ctrlKey, altKey, metaKey, shiftKey } = e;
      const isCtrlOnly = !altKey && !shiftKey && (ctrlKey || metaKey);
      const isShiftOnly = shiftKey && !ctrlKey && !metaKey && !altKey;
      switch (e.key) {
        case 'ArrowUp':
          triggerKeyboardChangeStart(e);
          if (isCtrlOnly) {
            // 扩大
            setBounds({ top: _top - 1, height: _height + 1 });
          } else if (isShiftOnly) {
            // 缩小
            setBounds({ height: _height - 1 });
          } else {
            // 上移
            setBounds({ top: _top - 1 });
          }
          break;
        case 'ArrowDown':
          triggerKeyboardChangeStart(e);
          if (isCtrlOnly) {
            // 扩大
            setBounds({ height: _height + 1 });
          } else if (isShiftOnly) {
            // 缩小
            setBounds({ top: _top + 1, height: _height - 1 });
          } else {
            // 下移
            setBounds({ top: _top + 1 });
          }
          break;
        case 'ArrowLeft':
          triggerKeyboardChangeStart(e);
          if (isCtrlOnly) {
            // 扩大
            setBounds({ left: _left - 1, width: _width + 1 });
          } else if (isShiftOnly) {
            // 缩小
            setBounds({ width: _width - 1 });
          } else {
            // 左移
            setBounds({ left: _left - 1 });
          }
          break;
        case 'ArrowRight':
          triggerKeyboardChangeStart(e);
          if (isCtrlOnly) {
            // 扩大
            setBounds({ width: _width + 1 });
          } else if (isShiftOnly) {
            // 缩小
            setBounds({ left: _left + 1, width: _width - 1 });
          } else {
            // 右移
            setBounds({ left: _left + 1 });
          }
          break;
      }
    }
  });

  const { rotate, ...basePosition } = bounds;

  return (
    <div
      ref={rootRef}
      className={cn(
        styles.root,
        {
          [styles.statusChecked]: checked,
          [styles.statusDisabled]: disabled,
        },
        className,
      )}
      style={{
        ...style,
        ...basePosition,
        transform: `rotate(${rotate || 0}deg)`,
      }}
      {...otherProps}
    >
      <div className={cn(styles.scaleHandle, styles.scaleHandleTop)} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleBottom)} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleRight)} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleLeft)} />

      <div className={cn(styles.scaleHandle, styles.scaleHandleTopLeft)} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleTopRight)} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleBottomLeft)} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleBottomRight)} />
      <div className={cn(styles.scaleHandle, styles.rotateHandle)} />
    </div>
  );
};

export default TransformerBox;
