import React, { useContext, useRef, useState } from 'react';
import cn from 'classnames';
import { useControllableValue, useDebounceFn, useEventListener, useMemoizedFn } from 'ahooks';
import { usePan } from '@orca-fe/hooks';
import ReactDOM from 'react-dom';
import { roundBy } from '@orca-fe/tools';
import type { Bounds, Point, ResizeType } from './utils';
import { calcBoundsChange, calcLimitBounds, getPointByEvent, getPointOffset, getResizeMode } from './utils';
import TransformerBoxContext from './TransformerBoxContext';
import useStyles from './TransformerBox.style';

const ef = () => {};

const roundBy45 = roundBy(45);

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export interface TransformerBoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {

  /** 是否禁用 */
  disabled?: boolean;

  /** 是否选中状态，选中状态下，才可以进行边框调整 */
  checked?: boolean;

  /** 最小拖动距离 */
  minDragDistance?: number;

  /** 默认的Bounds信息 */
  defaultBounds?: Bounds;

  /** Bounds信息 */
  bounds?: Bounds;

  /** 开始拖动时的回调函数 */
  onChangeStart?: (e: Event, type: ResizeType) => void;

  /** 拖动前的回调函数 */
  onDragBefore?: (e: MouseEvent) => boolean;

  /** Bounds信息变化时的回调函数 */
  onBoundsChange?: (bounds: Bounds) => void;

  /** 结束拖动时的回调函数 */
  onChangeEnd?: (bounds: Bounds) => void;

  /** 静态点击（非拖拽）时的回调函数 */
  onClickFixed?: (e: MouseEvent) => void;

  /** 是否受控模式，开启后，拖拽的过程，会实时触发 onBoundsChange */
  controlledMode?: boolean;

  /** 修改内容挂载点，默认挂载到边框内部。指定内挂载位置，可实现渲染多个 Box 时，内容不会遮挡边框，造成效果不佳 */
  portal?: () => HTMLElement | SVGSVGElement;

  /** 限制移动区域，设置之后，会以中心点为基准，不能移动超过 limitBounds 的范围 */
  limitBounds?: Bounds;

  /** 支持旋转 */
  rotateEnabled?: boolean;
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
    onChangeEnd: _onChangeEnd = ef,
    onChangeStart = ef,
    onClickFixed = ef,
    checked,
    style,
    controlledMode,
    portal,
    limitBounds,
    rotateEnabled,
    ...otherProps
  } = props;
  const styles = useStyles();

  const cursors = [styles.cursor0, styles.cursor1, styles.cursor2, styles.cursor3];

  const { getPointMapping } = useContext(TransformerBoxContext);

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

  const [_bounds, _setBounds] = useControllableValue<Bounds>(props, {
    defaultValuePropName: 'defaultBounds',
    valuePropName: 'bounds',
    trigger: 'onBoundsChange',
  });

  const [tmpBounds, setTmpBounds] = useState<Bounds | null>(null);

  const bounds = tmpBounds || _bounds;

  const { left: _left, top: _top, width: _width, height: _height } = bounds;

  const cursorDirection = (roundBy45(bounds.rotate || 0) / 45) % 4;

  const setBounds = useMemoizedFn((param: React.SetStateAction<Partial<Bounds>>) => {
    if (controlledMode) {
      _setBounds((bounds) => {
        const newBounds = typeof param === 'function' ? param(bounds) : param;
        return {
          ...bounds,
          ...newBounds,
        };
      });
    } else {
      setTmpBounds((tmpBounds) => {
        const bounds = tmpBounds || _bounds;
        const newBounds = typeof param === 'function' ? param(bounds) : param;
        return {
          ...bounds,
          ...newBounds,
        };
      });
    }
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
        ...calcLimitBounds({ ..._bounds, ...changedState }, limitBounds),
      });
    }
  });

  const onChangeEnd = useMemoizedFn(() => {
    if (!controlledMode && tmpBounds) {
      _setBounds(tmpBounds);
    }
    setTmpBounds(null);
    _onChangeEnd(tmpBounds || _bounds);
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
    const currentPoint = getPointMapping(getPointByEvent(ev));
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

  // 获取内容挂载的位置
  const contentRoot = portal ? portal() : null;

  const positionStyle = {
    left: `calc(var(--transformer-box-scale) * ${Math.round(bounds.left)}px)`,
    top: `calc(var(--transformer-box-scale) * ${Math.round(bounds.top)}px)`,
    width: `calc(var(--transformer-box-scale) * ${Math.round(bounds.width)}px)`,
    height: `calc(var(--transformer-box-scale) * ${Math.round(bounds.height)}px)`,
    transform: `rotate(${bounds.rotate || 0}deg)`,
  };

  const content = contentRoot ? (
    ReactDOM.createPortal(
      <div
        className={cn(styles.content, {
          [styles.statusChecked]: checked && !disabled,
          [styles.statusDisabled]: disabled,
        })}
        style={positionStyle}
      >
        {children}
      </div>,
      contentRoot,
    )
  ) : (
    <div className={styles.content}>{children}</div>
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        styles.root,
        {
          [styles.statusChecked]: checked && !disabled,
          [styles.statusDisabled]: disabled,
        },
        className,
      )}
      style={{
        ...style,
        ...positionStyle,
      }}
      {...otherProps}
    >
      {content}

      <div className={cn(styles.scaleHandle, styles.scaleHandleTop, cursors[mod(0 + cursorDirection, 4)])} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleBottom, cursors[mod(0 + cursorDirection, 4)])} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleRight, cursors[mod(2 + cursorDirection, 4)])} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleLeft, cursors[mod(2 + cursorDirection, 4)])} />

      <div className={cn(styles.scaleHandle, styles.scaleHandleTopLeft, cursors[mod(3 + cursorDirection, 4)])} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleTopRight, cursors[mod(1 + cursorDirection, 4)])} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleBottomLeft, cursors[mod(1 + cursorDirection, 4)])} />
      <div className={cn(styles.scaleHandle, styles.scaleHandleBottomRight, cursors[mod(3 + cursorDirection, 4)])} />
      {rotateEnabled && <div className={cn(styles.scaleHandle, styles.rotateHandle)} />}
    </div>
  );
};

export default TransformerBox;
