import { useBoolean, useLatest, useMemoizedFn, useRafState, useSize, useThrottleFn } from 'ahooks';
import { useEffect, useRef } from 'react';
import { round } from 'lodash-es';
import type { ScrollListenController } from 'ahooks/lib/useScroll';
import type { BasicTarget } from './utils/domTarget';
import { getTargetElement } from './utils/domTarget';
import useAnimationFrame from './useAnimationFrame';
import useEffectWithTarget from './useEffectWithTarget';

type Position = { left: number; top: number };

export const MANUAL_SCROLL_UP = 'up'; // 向上滚动
export const MANUAL_SCROLL_DOWN = 'down'; // 向下滚动
export const MANUAL_SCROLL_LEFT = 'left'; // 向左滚动
export const MANUAL_SCROLL_RIGHT = 'right'; // 向右滚动
export type ManualScrollDirection = typeof MANUAL_SCROLL_UP | typeof MANUAL_SCROLL_DOWN | typeof MANUAL_SCROLL_LEFT | typeof MANUAL_SCROLL_RIGHT;

export type UseManualScrollOptions = {

  /** 默认触发的滚动量 */
  defaultScrollStep?: number;

  /** 滚动时长，单位毫秒 */
  duration?: number;

  /** 控制是否更新滚动信息（同 useScroll） */
  shouldUpdate?: ScrollListenController;
};

// 基准帧间隔
const baseFrameInterval = 16.67;

type ManualScrollState = {

  /** 上一帧的时间 */
  lastFrameTime: number | null;

  /** 已执行的动画时长 */
  animDuration: number;

  /** 当前滚动量 */
  scrollStep: number;

  /** 当前滚动方向 */
  direction: ManualScrollDirection | null;

  /** 当前累计滚动距离 */
  scrollDistance: number;

  /** 滚动偏移的误差值 */
  scrollOffset: {
    x: number;
    y: number;
  };
};

// 是否水平滚动
const isHorizScroll = (direction: ManualScrollDirection) => direction === MANUAL_SCROLL_LEFT || direction === MANUAL_SCROLL_RIGHT;

export default function useManualScroll(target: BasicTarget, options: UseManualScrollOptions = {}) {
  const { defaultScrollStep = 200, duration = 300, shouldUpdate = () => true } = options;

  const _this = useRef<ManualScrollState>({
    scrollDistance: 0,
    lastFrameTime: null,
    animDuration: 0,
    direction: null,
    scrollStep: defaultScrollStep,
    scrollOffset: { x: 0, y: 0 },
  }).current;

  const [scrolling, { setTrue: startScrolling, setFalse: stopScrolling }] = useBoolean(false);

  const dom = getTargetElement(target);
  const size = useSize(target);

  // 透传出的容器滚动位置信息（依赖 shouldUpdate）
  const [position, setPosition] = useRafState<Position>();
  // 保存容器最新的滚动位置信息
  const latestPositionRef = useRef<Position>();
  const shouldUpdateRef = useLatest(shouldUpdate);

  // 根据当前位置获取各方位滚动状态
  const scrollBoundaryState = useMemoizedFn((currentPosition?: Position) => {
    const scrollToLeft = currentPosition?.left === 0;
    const scrollToRight = Math.ceil((currentPosition?.left ?? 0) + (size?.width ?? 0)) >= (dom?.scrollWidth ?? 0);
    const scrollToTop = currentPosition?.top === 0;
    const scrollToBottom = Math.ceil((currentPosition?.top ?? 0) + (size?.height ?? 0)) >= (dom?.scrollHeight ?? 0);

    return {
      scrollToLeft,
      scrollToRight,
      scrollToTop,
      scrollToBottom,
    };
  });

  // 获取当前帧间隔
  const currentFrameInterval = useMemoizedFn((ms: number, frameTime: number) => {
    if (!_this.lastFrameTime) {
      _this.lastFrameTime = frameTime;
    }
    const frameInterval = ms - _this.lastFrameTime || baseFrameInterval;

    return _this.animDuration + frameInterval > duration ? duration - _this.animDuration : frameInterval;
  });

  // 获取当前帧滚动量
  const currentFrameStep = useMemoizedFn((frameInterval: number) => {
    // 基准帧滚动量
    const baseFrameStep = _this.scrollStep / (duration / baseFrameInterval);
    // 帧间隔偏差比例
    const deviationRatio = frameInterval / baseFrameInterval;
    // 当前帧滚动量
    const frameStep = deviationRatio * baseFrameStep;

    return _this.scrollDistance + frameStep > _this.scrollStep ? _this.scrollStep - _this.scrollDistance : frameStep;
  });

  // 是否抵达边界
  const isReachToBoundary = useMemoizedFn(() => {
    const latestPosition = scrollBoundaryState(latestPositionRef.current);
    if (_this.direction === MANUAL_SCROLL_LEFT) return latestPosition.scrollToLeft;
    if (_this.direction === MANUAL_SCROLL_RIGHT) return latestPosition.scrollToRight;
    if (_this.direction === MANUAL_SCROLL_UP) return latestPosition.scrollToTop;
    if (_this.direction === MANUAL_SCROLL_DOWN) return latestPosition.scrollToBottom;

    return false;
  });

  // modify from `useScroll`
  useEffectWithTarget(
    () => {
      const el = getTargetElement(target);
      if (!el) {
        return;
      }
      const updatePosition = () => {
        const newPosition: Position = {
          left: el.scrollLeft,
          top: el.scrollTop,
        };
        if (shouldUpdateRef.current(newPosition)) {
          setPosition(newPosition);
        }

        latestPositionRef.current = newPosition;
      };

      updatePosition();

      el.addEventListener('scroll', updatePosition);
      // eslint-disable-next-line consistent-return
      return () => {
        el.removeEventListener('scroll', updatePosition);
      };
    },
    [],
    target,
  );

  const rafHandler = useAnimationFrame(
    (ms, frameTime) => {
      if (!dom || !_this.direction || _this.animDuration >= duration) {
        stopScrolling();
        return;
      }

      if (isReachToBoundary()) {
        if (isHorizScroll(_this.direction)) _this.scrollOffset.x = 0;
        else _this.scrollOffset.y = 0;
        stopScrolling();
        return;
      }

      // 当前帧间隔
      const frameInterval = currentFrameInterval(ms, frameTime);
      // 当前帧滚动量
      const frameStep = currentFrameStep(frameInterval);

      // 累计滚动量
      _this.scrollDistance += frameStep;
      // 累计动画时间
      _this.animDuration += frameInterval;

      let xScrollValue = 0;
      let yScrollValue = 0;

      // 向左滚动
      if (_this.direction === MANUAL_SCROLL_LEFT) {
        xScrollValue = round(dom.scrollLeft - frameStep, 2) + _this.scrollOffset.x;
      }
      // 向右滚动
      if (_this.direction === MANUAL_SCROLL_RIGHT) {
        xScrollValue = round(dom.scrollLeft + frameStep, 2) + _this.scrollOffset.x;
      }
      // 向上滚动
      if (_this.direction === MANUAL_SCROLL_UP) {
        yScrollValue = round(dom.scrollTop - frameStep, 2) + _this.scrollOffset.y;
      }
      // 向下滚动
      if (_this.direction === MANUAL_SCROLL_DOWN) {
        yScrollValue = round(dom.scrollTop + frameStep, 2) + _this.scrollOffset.y;
      }

      // 滚动并更新误差值
      if (isHorizScroll(_this.direction)) {
        dom.scrollLeft = xScrollValue;
        _this.scrollOffset.x = xScrollValue - dom.scrollLeft;
      } else {
        dom.scrollTop = yScrollValue;
        _this.scrollOffset.y = yScrollValue - dom.scrollTop;
      }
    },
    { manual: true },
  );

  const run = (direction: ManualScrollDirection, scrollStep: number = defaultScrollStep) => {
    _this.direction = direction;
    _this.scrollStep = scrollStep;

    const latestPosition = scrollBoundaryState(latestPositionRef.current);

    if (direction === MANUAL_SCROLL_LEFT && latestPosition.scrollToLeft) return;
    if (direction === MANUAL_SCROLL_RIGHT && latestPosition.scrollToRight) return;
    if (direction === MANUAL_SCROLL_UP && latestPosition.scrollToTop) return;
    if (direction === MANUAL_SCROLL_DOWN && latestPosition.scrollToBottom) return;

    startScrolling();
  };

  const { run: throttleRun } = useThrottleFn(run, { wait: duration });

  useEffect(() => {
    if (scrolling) {
      _this.animDuration = 0;
      _this.scrollDistance = 0;
      _this.lastFrameTime = null;
      rafHandler.start();
    } else {
      rafHandler.stop();
    }
  }, [scrolling]);

  return {
    position,
    run: useMemoizedFn(throttleRun),
    ...scrollBoundaryState(position),
  };
}
