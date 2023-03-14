import React, { useImperativeHandle, useRef, useState } from 'react';
import { useSizeListener } from '@orca-fe/hooks';
import useStyle from './AutoScaleBox.style';

export interface AutoScaleBoxProps
  extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  mode?: 'contain' | 'cover';
}

const AutoScaleBox = React.forwardRef((props: AutoScaleBoxProps, pRef) => {
  const {
    className = '',
    children,
    width,
    height,
    mode = 'contain',
    ...otherProps
  } = props;

  const styles = useStyle();

  const rootRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(pRef, () => rootRef.current);

  const [size, setSize] = useState({ width: 100, height: 100 });
  const [ratio, setRatio] = useState(1);

  useSizeListener((realSize) => {
    const fn = mode === 'contain' ? Math.min : Math.max;
    const ratio = fn(realSize.width / width, realSize.height / height);
    setRatio(ratio);
    setSize(realSize);
  }, rootRef);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className}`}
      {...otherProps}
    >
      <div
        className={styles.container}
        style={{
          width: Math.round(size.width / ratio),
          height: Math.round(size.height / ratio),
          transform: `translate(-50%, -50%) scale(${ratio})`,
        }}
      >
        {children}
      </div>
    </div>
  );
});

export default AutoScaleBox;
