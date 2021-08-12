import { useEffect, useState } from 'react';

const useWindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    const callback = () => {
      if (window.innerWidth !== width) {
        setWidth(window.innerWidth);
      }
      if (window.innerHeight !== height) {
        setHeight(window.innerHeight);
      }
    };
    window.addEventListener('resize', callback);
    return () => {
      window.removeEventListener('resize', callback);
    };
  }, [width, height]);
  return { width, height };
};

export default useWindowSize;
