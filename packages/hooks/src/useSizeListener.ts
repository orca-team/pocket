import { useEffect, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { BasicTarget, getTargetElement } from './domTarget';
import useMemorizedFn from './useMemorizedFn';

type Size = { width: number; height: number };

export default function useSizeListener(
  callback: (size: Size) => void,
  target: BasicTarget,
) {
  const callbackProxy = useMemorizedFn(callback);

  const realTarget = getTargetElement(target);
  useEffect(() => {
    if (realTarget) {
      const ro = new ResizeObserver(() => {
        const width = realTarget.clientWidth;
        const height = realTarget.clientHeight;
        callbackProxy({
          width,
          height,
        });
      });
      ro.observe(realTarget);
      return () => {
        ro.disconnect();
      };
    }
    return undefined;
  }, [realTarget]);
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
      _this.size.width !== width &&
      _this.size.height !== height
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
