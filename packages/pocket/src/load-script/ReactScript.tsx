import { usePersistFn, usePrevious } from 'ahooks';
import { eq } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import loadScript from './LoadScript';

export interface ReactScriptProps {
  src: string | string[];
  onLoad?: () => void;
  onError?: (err: Error) => void;
  children?: React.ReactNode;
}

const ReactScript = (props: ReactScriptProps) => {
  const { src, onError, onLoad, children = null } = props;
  const [loaded, setLoaded] = useState(false);

  const handleLoad = usePersistFn(() => {
    onLoad?.();
    setLoaded(true);
  });
  const handleError = usePersistFn((err) => {
    onError?.(err);
  });

  const prevSrc = usePrevious(src);

  useEffect(() => {
    if (!eq(src, prevSrc)) {
      const srcList = Array.isArray(src) ? src : [src];
      Promise.all(
        srcList.map((src) => loadScript(src).catch(handleError)),
      ).then(handleLoad);
    }
  }, [src]);
  return (loaded && children) as React.ReactElement;
};

export default ReactScript;
