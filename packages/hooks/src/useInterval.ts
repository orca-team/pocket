import { useEffect, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';

export default function useInterval(callback: () => void, interval?: number) {
  const callbackMemorizedFn = useMemoizedFn(callback);

  const ref = useRef<number | undefined>();

  const start = useMemoizedFn(() => {
    if (!ref.current && interval != null && interval > 0) {
      ref.current = window.setInterval(callbackMemorizedFn, interval);
    }
  });

  const stop = useMemoizedFn(() => {
    if (ref.current) {
      window.clearInterval(ref.current);
      ref.current = undefined;
    }
  });

  const reset = useMemoizedFn(() => {
    stop();
    start();
  });

  useEffect(reset, [interval]);

  useEffect(() => stop, []);
  return {
    start,
    reset,
    stop,
  };
}
