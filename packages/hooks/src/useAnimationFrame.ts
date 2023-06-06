import { useEffect, useMemo, useState } from 'react';
import useMemoizedFn from './useMemorizedFn';

export type UseAnimationFrameOptions = {

  /** 手动触发 */
  manual?: boolean;
};

const useAnimationFrame = (callback = (ms: number, stepMs: number) => {}, options: UseAnimationFrameOptions = {}) => {
  const { manual } = options;
  const cb = useMemoizedFn(callback);
  const [_this] = useState({ timer: 0, running: false });

  const [running, setRunning] = useState(false);

  const stop = () => {
    window.cancelAnimationFrame(_this.timer);
    _this.running = false;
    setRunning(false);
  };

  const start = () => {
    stop();
    let lastTime = 0;
    _this.running = true;
    setRunning(true);
    const runTimer = () => {
      _this.timer = window.requestAnimationFrame((ms) => {
        cb(ms, ms - lastTime);
        lastTime = ms;
        runTimer();
      });
    };
    runTimer();
  };

  const toggle = useMemoizedFn(() => {
    if (_this.running) {
      stop();
    } else {
      start();
    }
  });

  useEffect(() => {
    if (!manual) {
      start();
    }
    return stop;
  }, []);

  return useMemo(
    () => ({
      start,
      stop,
      toggle,
      running,
    }),
    [running],
  );
};

export default useAnimationFrame;
