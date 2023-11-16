import { useMemorizedFn } from '@orca-fe/hooks';
import { useState } from 'react';

export default function useCollector<T>() {
  const [_this] = useState({
    callbacks: [] as ((...args: any[]) => T[])[],
  });

  const collect = useMemorizedFn((...args) => _this.callbacks.map(cb => cb(...args)).flat());

  const on = useMemorizedFn((callback: (...args: any[]) => T[]) => {
    _this.callbacks.push(callback);
  });

  const off = useMemorizedFn((callback: (...args: any[]) => T[]) => {
    _this.callbacks = _this.callbacks.filter(cb => cb !== callback);
  });

  return {
    collect,
    on,
    off,
  };
}
