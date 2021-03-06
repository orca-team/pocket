// Copy from ahooks@3
import { useMemo, useRef } from 'react';

type noop = (...args: any[]) => any;

function useMemorizedFn<T extends noop>(fn: T) {
  if (process.env.NODE_ENV === 'development') {
    if (typeof fn !== 'function') {
      console.error(
        `useMemorizedFn expected parameter is a function, got ${typeof fn}`,
      );
    }
  }

  const fnRef = useRef<T>(fn);

  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  fnRef.current = useMemo(() => fn, [fn]);

  const memoizedFn = useRef<T>();
  if (!memoizedFn.current) {
    memoizedFn.current = function (...args) {
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      return fnRef.current.apply(this, args);
    } as T;
  }

  return memoizedFn.current;
}

export default useMemorizedFn;
