import type { Target } from 'ahooks/lib/useEventListener';
import { useEventListener } from 'ahooks';
import { useRef } from 'react';
import useMemorizedFn from './useMemorizedFn';

export type UseStaticClickOptions<T extends Target = Target> = {
  target?: T;
  distance?: number;
};

export default function useStaticClick<T extends Target = Target>(
  _callback: (e: MouseEvent) => void,
  options: UseStaticClickOptions<T> = {},
) {
  const mousePointRef = useRef([0, 0] as [number, number]);

  const { distance = 2, target } = options;

  const callback = useMemorizedFn(_callback);

  useEventListener(
    'mousedown',
    (e) => {
      mousePointRef.current = [e.clientX, e.clientY];
    },
    { target },
  );

  useEventListener(
    'click',
    (e) => {
      if (mousePointRef.current) {
        const [x, y] = mousePointRef.current;
        const d = (x - e.clientX) ** 2 + (y - e.clientY) ** 2;
        if (d <= distance ** 2) {
          callback(e);
        }
      }
    },
    { target },
  );
}
