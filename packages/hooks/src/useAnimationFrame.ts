import { useEffect } from 'react';
import { usePersistFn } from 'ahooks';

const useAnimationFrame = (callback = (ms: number, stepMs: number) => {}) => {
  const cb = usePersistFn(callback);
  useEffect(() => {
    let timer = -1;
    let lastTime = 0;
    const runTimer = () => {
      timer = window.requestAnimationFrame((ms) => {
        cb(ms, ms - lastTime);
        lastTime = ms;
        runTimer();
      });
    };
    runTimer();
    return () => {
      window.cancelAnimationFrame(timer);
    };
  }, []);
};

export default useAnimationFrame;
