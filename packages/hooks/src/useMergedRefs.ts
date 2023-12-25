import type React from 'react';
import { useMemoizedFn } from 'ahooks';

export default function useMergedRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return useMemoizedFn((instance: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref != null && typeof ref === 'object') {
        // eslint-disable-next-line no-param-reassign
        (ref as React.MutableRefObject<T>).current = instance;
      }
    });
  });
}

useMergedRefs.mergeRefs =
  <T>(refs: React.Ref<T>[]) =>
    (instance: T) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref != null && typeof ref === 'object') {
        // eslint-disable-next-line no-param-reassign
          (ref as React.MutableRefObject<T>).current = instance;
        }
      });
    };
