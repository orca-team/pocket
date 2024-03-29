import { useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { useDebounceFn } from 'ahooks';
import type { BasicTarget } from './utils/domTarget';
import { getTargetElement } from './utils/domTarget';
import useMemorizedFn from './useMemorizedFn';
import useEffectWithTarget from './useEffectWithTarget';

type Size = { width: number; height: number };

export default function useSizeListener(
  callback: (size: Size) => void,
  target: BasicTarget,
) {
  const callbackProxy = useMemorizedFn(callback);

  useEffectWithTarget(
    () => {
      const realTarget = getTargetElement(target);
      if (realTarget) {
        const ro = new ResizeObserver(() => {
          if (realTarget) {
            const width = realTarget.clientWidth;
            const height = realTarget.clientHeight;
            callbackProxy({
              width,
              height,
            });
          }
        });
        ro.observe(realTarget);
        return () => {
          ro.disconnect();
        };
      }
      return undefined;
    },
    [],
    target,
  );
}

export function useSizeUpdateListener(
  callback: (size: Size) => void,
  target: BasicTarget,
) {
  const callbackProxy = useMemorizedFn(callback);
  const [_this] = useState<{ size: Size | undefined }>({ size: undefined });
  useSizeListener(({ width, height }) => {
    if (
      _this.size &&
      (_this.size.width !== width || _this.size.height !== height)
    ) {
      callbackProxy({
        width,
        height,
      });
    }
    _this.size = {
      width,
      height,
    };
  }, target);
}

export function useSizeDebounceListener(
  callback: (size: Size, scale?: { x: number; y: number }) => void,
  target: BasicTarget,
  debounceInterval = 300,
) {
  const callbackProxy = useMemorizedFn(callback);
  const [_this] = useState<{ size: Size | undefined }>({ size: undefined });

  const debounceCallback = useDebounceFn<typeof callback>(
    (size, scale) => {
      _this.size = size;
      callback(size, scale);
    },
    {
      wait: debounceInterval,
    },
  );

  useSizeListener(({ width, height }) => {
    debounceCallback.run({
      width,
      height,
    });
    if (_this.size) {
      callbackProxy(_this.size, {
        x: width / (_this.size.width || 1),
        y: height / (_this.size.height || 1),
      });
    } else {
      debounceCallback.flush();
    }
  }, target);
}
