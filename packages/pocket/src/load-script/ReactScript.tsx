import { usePrevious } from 'ahooks-v2';
import { eq } from 'lodash-es';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useMemorizedFn } from '@orca-fe/hooks';
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

  const handleLoad = useMemorizedFn(() => {
    onLoad?.();
    setLoaded(true);
  });
  const handleError = useMemorizedFn((err) => {
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
