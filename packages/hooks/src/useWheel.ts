import { useDebounceFn, useEventListener, useSetState } from 'ahooks';
import { add } from 'lodash-es';
import type { BasicTarget } from './utils/domTarget';

export const WHEEL_UP = 'up'; // 向上滚动
export const WHEEL_DOWN = 'down'; // 向下滚动
export const WHEEL_LEFT = 'left'; // 向左滚动
export const WHEEL_RIGHT = 'right'; // 向右滚动
export type WheelScrollDirection = typeof WHEEL_UP | typeof WHEEL_DOWN | typeof WHEEL_LEFT | typeof WHEEL_RIGHT;

export type WheelScrollState = {

  /**  滚动中 */
  rolling: boolean;

  /** 当前滚动方向 */
  direction: WheelScrollDirection | null;

  /** 偏移量 */
  movement: number;

  /** 累计滚动距离 */
  distance: number;
};

export type UseWheelOptions = {

  /** 判断滚轮停止滚动毫秒数，必须大于最小延迟毫秒数 */
  delay?: number;
};

// 鼠标滚轮最小延迟毫秒数
const minWheelStopDelay = 300;

const defaultState: WheelScrollState = {
  rolling: false,
  direction: null,
  movement: 0,
  distance: 0,
};

export default function useWheel(target: BasicTarget, options: UseWheelOptions = {}) {
  const { delay = minWheelStopDelay } = options;
  const [state, setState] = useSetState<WheelScrollState>(defaultState);

  const { run: debounceStopWheelScroll } = useDebounceFn(
    () => {
      setState(defaultState);
    },
    { wait: delay > minWheelStopDelay ? delay : minWheelStopDelay },
  );

  useEventListener(
    'wheel',
    (event: WheelEvent) => {
      event.preventDefault();
      const { deltaX, deltaY } = event;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setState({
          rolling: true,
          direction: deltaX > 0 ? WHEEL_RIGHT : WHEEL_LEFT,
          movement: deltaX,
          distance: add(state.distance, deltaX),
        });
      } else {
        setState({
          rolling: true,
          direction: deltaY > 0 ? WHEEL_DOWN : WHEEL_UP,
          movement: deltaY,
          distance: add(state.distance, deltaY),
        });
      }
      debounceStopWheelScroll();
    },
    { target },
  );

  return state;
}
