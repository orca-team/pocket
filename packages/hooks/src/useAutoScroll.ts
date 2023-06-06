import { useEventListener, useUpdateEffect } from 'ahooks';
import { useState } from 'react';
import useAnimationFrame from './useAnimationFrame';
import type { BasicTarget } from './utils/domTarget';
import { getTargetElement } from './utils/domTarget';

type Bounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type UseAutoScrollOptions = {

  /** 触发滚动的边缘区域大小 */
  edgeSize?: number;

  /** 实时获取容器 bounds */
  realtimeBounds?: boolean;

  /** 根据点击事件自动触发滚动 */
  autoTrigger?: boolean;

  /** 是否支持横向滚动 */
  scrollableX?: boolean;

  /** 是否支持纵向滚动 */
  scrollableY?: boolean;
};

export default function useAutoScroll(target: BasicTarget, options: UseAutoScrollOptions = {}) {
  const { edgeSize = 100, realtimeBounds, autoTrigger = true, scrollableX = true, scrollableY = true } = options;
  const [_this] = useState(() => ({
    mouse: [0, 0] as [number, number],
    bounds: undefined as Bounds | undefined,
  }));

  const rafHandle = useAnimationFrame(
    () => {
      const dom = getTargetElement(target);
      if (!dom) return;
      if (!_this.bounds) {
        _this.bounds = dom.getBoundingClientRect();
      }
      const { left, top, width, height } = realtimeBounds ? dom.getBoundingClientRect() : _this.bounds;
      const x = _this.mouse[0] - left;
      const y = _this.mouse[1] - top;

      const xEdgeSize = Math.min(edgeSize, width * 0.2);
      const yEdgeSize = Math.min(edgeSize, height * 0.2);

      let xScrollValue = 0;
      let yScrollValue = 0;

      if (x < xEdgeSize) {
        // 向左移动
        xScrollValue = Math.max(-50, 0.1 * Math.round(x - xEdgeSize));
      } else if (x > width - xEdgeSize) {
        // 向右移动
        xScrollValue = Math.min(50, 0.1 * Math.round(x - width + xEdgeSize));
      }

      if (y < yEdgeSize) {
        // 向上移动
        yScrollValue = Math.max(-50, 0.1 * Math.round(y - yEdgeSize));
      } else if (y > height - yEdgeSize) {
        // 向下移动
        yScrollValue = Math.min(50, 0.1 * Math.round(y - height + yEdgeSize));
      }

      if (scrollableX) {
        dom.scrollLeft += xScrollValue;
      }
      if (scrollableY) {
        dom.scrollTop += yScrollValue;
      }
    },
    { manual: true },
  );

  useUpdateEffect(() => {
    if (!rafHandle.running) {
      _this.bounds = undefined;
    }
  }, [rafHandle.running]);

  useEventListener(
    'mousedown',
    () => {
      const dom = getTargetElement(target);
      if (dom) {
        _this.bounds = dom.getBoundingClientRect();
      }
      if (autoTrigger) {
        rafHandle.start();
      }
    },
    { target },
  );

  useEventListener('mouseup', () => {
    if (autoTrigger) {
      rafHandle.stop();
    }
  });

  useEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    _this.mouse = [clientX, clientY];
  });

  return rafHandle;
}
