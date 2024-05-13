import React, { useContext, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { useControllableValue, useEventListener, useMemoizedFn } from 'ahooks';
import { usePan } from '@orca-fe/hooks';
import { changeArr } from '@orca-fe/tools';
import useStyles, { prefix } from './TransformerLine.style';
import type { Bounds, Point } from '../TransformerBox/utils';
import { getPointByEvent, getPointOffset } from '../TransformerBox/utils';
import TransformerBoxContext from '../TransformerBox/TransformerBoxContext';

const ef = () => {};

const eArr = [];

function getBounds(points: Point[]): Bounds {
  const xArr = points.map(p => p.x);
  const yArr = points.map(p => p.y);
  return {
    left: Math.min(...xArr),
    top: Math.min(...yArr),
    width: Math.max(...xArr) - Math.min(...xArr),
    height: Math.max(...yArr) - Math.min(...yArr),
  };
}

export interface TransformerLineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {

  /** 是否禁用 */
  disabled?: boolean;

  /** 是否选中状态，选中状态下，才可以进行边框调整 */
  checked?: boolean;

  /** 最小拖动距离 */
  minDragDistance?: number;

  /** 开始拖动时的回调函数 */
  onChangeStart?: (e: Event) => void;

  /** 拖动前的回调函数 */
  onDragBefore?: (e: MouseEvent | TouchEvent) => boolean;

  /** 点位信息(默认) */
  defaultPoints?: Point[];

  /** 点位信息 */
  points?: Point[];

  /** 点位信息变化时的回调函数 */
  onPointsChange?: (points: Point[]) => void;

  /** 结束拖动时的回调函数 */
  onChangeEnd?: (points: Point[]) => void;

  /** 静态点击（非拖拽）时的回调函数 */
  onClickFixed?: (e: MouseEvent) => void;

  /** 是否受控模式，开启后，拖拽的过程，会实时触发 onBoundsChange */
  controlledMode?: boolean;

  /** 修改内容挂载点，默认挂载到边框内部。指定内挂载位置，可实现渲染多个 Box 时，内容不会遮挡边框，造成效果不佳 */
  portal?: () => HTMLElement | SVGSVGElement;
}

const TransformerLine = (props: TransformerLineProps) => {
  const {
    className = '',
    children,
    points: nouse1,
    onPointsChange: nouse2,
    defaultPoints,
    disabled,
    minDragDistance = 4,
    onDragBefore = ef,
    onChangeEnd: _onChangeEnd = ef,
    onChangeStart = ef,
    onClickFixed = ef,
    checked,
    controlledMode = true,
    portal,
    ...otherProps
  } = props;

  const styles = useStyles();

  const { getPointMapping } = useContext(TransformerBoxContext);

  const [_this] = useState({
    distanceLock: false,
    pointerDownIndex: -1,
    // 鼠标按下时的Bounds信息，也用于表达鼠标按下状态
    pointerDownPoints: false as false | Point[],
    // 鼠标按下时的鼠标坐标
    pointerDownPosition: { x: 0, y: 0 } as Point,
    currentPoint: { x: 0, y: 0 } as Point,
    lastClickTime: 0,
    ctrlDown: false,
    shiftDown: false,
  });

  const [_points = eArr, _setPoints] = useControllableValue<Point[]>(props, {
    defaultValuePropName: 'defaultPoints',
    valuePropName: 'points',
    trigger: 'onPointsChange',
  });

  const [tmpPoints, setTmpPoints] = useState<Point[] | null>(null);

  const points = tmpPoints || _points;

  const setPoints = useMemoizedFn((param: React.SetStateAction<Point[]>) => {
    if (controlledMode) {
      _setPoints(param);
    } else {
      setTmpPoints((tmpBounds) => {
        const bounds = tmpBounds || _points;
        const newPoints = typeof param === 'function' ? param(bounds) : param;
        return newPoints;
      });
    }
  });

  const changeBounds = useMemoizedFn(() => {
    const points = _this.pointerDownPoints;
    if (!points) return;
    const pointOffset = getPointOffset(_this.pointerDownPosition, _this.currentPoint);
    if (!_this.distanceLock || minDragDistance ** 2 < pointOffset.x ** 2 + pointOffset.y ** 2) {
      /* 解锁距离锁 */
      _this.distanceLock = false;
      if (_this.pointerDownIndex === -2) {
        // 全量点移动
        setPoints(
          points.map(point => ({
            x: point.x + pointOffset.x,
            y: point.y + pointOffset.y,
          })),
        );
      } else {
        setPoints(
          changeArr(points, _this.pointerDownIndex, {
            x: points[_this.pointerDownIndex].x + pointOffset.x,
            y: points[_this.pointerDownIndex].y + pointOffset.y,
          }),
        );
      }
    }
  });

  const onChangeEnd = useMemoizedFn(() => {
    if (!controlledMode && tmpPoints) {
      _setPoints(tmpPoints);
    }
    setTmpPoints(null);
    _onChangeEnd(tmpPoints || _points);
  });

  const rootRef = useRef<HTMLDivElement>(null);
  usePan(({ target, start, startPosition, ev, offset, finish }) => {
    const currentPoint = getPointMapping(getPointByEvent(ev));
    if (start) {
      _this.distanceLock = true;
      if (target instanceof HTMLDivElement) {
        const isPointHandle = target.classList.contains(`${prefix}-point-handle`);
        const isMoveHandle = target.classList.contains(`${prefix}-move-handle`);
        if (!isPointHandle && !isMoveHandle) {
          return false;
        }
        const draggable = onDragBefore(ev);
        if (draggable === false) {
          return false;
        }

        /* 加距离锁 */
        _this.pointerDownPosition = currentPoint;
        _this.currentPoint = _this.pointerDownPosition;
        _this.pointerDownPoints = points;
        if (isPointHandle) {
          _this.pointerDownIndex = Number(target.attributes.getNamedItem('data-index')?.value) ?? -1;
        } else {
          _this.pointerDownIndex = -2;
        }
        onChangeStart(ev);
      } else {
        return false;
      }
    }

    if (finish) {
      if (_this.pointerDownPoints) {
        _this.pointerDownPoints = false;
        onChangeEnd();
      }
      return true;
    }

    if (_this.pointerDownPoints && _this.pointerDownIndex !== -1) {
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

  const bounds = useMemo(() => getBounds(points), [points]);

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
      {...otherProps}
    >
      {points.slice(0, points.length - 1).map((point, index) => {
        // 计算两点的角度
        const nextPoint = points[index + 1];
        const angle = (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180) / Math.PI;
        // 计算两点的距离
        const distance = Math.sqrt((nextPoint.x - point.x) ** 2 + (nextPoint.y - point.y) ** 2);
        return (
          <div
            key={index}
            className={cn(styles.moveHandle)}
            data-index={index}
            style={{
              left: `calc(var(--transformer-box-scale) * ${Math.round(point.x)}px)`,
              top: `calc(var(--transformer-box-scale) * ${Math.round(point.y)}px)`,
              width: `calc(var(--transformer-box-scale) * ${Math.round(distance)}px)`,
              transformOrigin: 'left center',
              transform: `translateY(-50%) rotate(${angle}deg)`,
            }}
          />
        );
      })}
      {points.map((point, index) => (
        <div
          key={index}
          className={cn(styles.pointHandle)}
          data-index={index}
          style={{
            left: `calc(var(--transformer-box-scale) * ${Math.round(point.x)}px)`,
            top: `calc(var(--transformer-box-scale) * ${Math.round(point.y)}px)`,
          }}
        />
      ))}

      {/* 隐藏的 bounds*/}
      <div
        className={cn(styles.content)}
        style={{
          left: `calc(var(--transformer-box-scale) * ${Math.round(bounds.left)}px)`,
          top: `calc(var(--transformer-box-scale) * ${Math.round(bounds.top)}px)`,
          width: `calc(var(--transformer-box-scale) * ${Math.round(bounds.width)}px)`,
          height: `calc(var(--transformer-box-scale) * ${Math.round(bounds.height)}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default TransformerLine;
