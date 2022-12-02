import { useEffect, useState } from 'react';
import useMemorizedFn from './useMemorizedFn';

type AnyFunction = (...args: unknown[]) => unknown;

export default function useNextTick() {
  // nextTick
  const [functionList] = useState<AnyFunction[]>([]);

  const nextTick = useMemorizedFn((fn: AnyFunction) => {
    functionList.push(fn);
  });

  useEffect(() => {
    while (functionList.length > 0) {
      const fn = functionList.shift();
      try {
        if (typeof fn === 'function') {
          fn();
        }
      } catch (error) {
        console.error(error);
        console.error('Error while calling nextTick.');
      }
    }
  });

  return nextTick;
}
