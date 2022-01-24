import { useMount, usePersistFn, useUpdateEffect } from 'ahooks-v2';
import React, { useImperativeHandle, useRef } from 'react';
import prefixClassnames from 'prefix-classnames';

const px = prefixClassnames('orca-open-box');

export interface OpenBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  height?: number;
}

const OpenBox: React.FC<OpenBoxProps> = React.forwardRef((props, pRef) => {
  const { className = '', open, height = 0, style, ...otherProps } = props;
  const ref = useRef<HTMLDivElement>(null);
  useImperativeHandle(pRef, () => ref.current);

  useMount(() => {
    if (ref.current) {
      if (open) {
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      } else {
        ref.current.style.height = `${height}px`;
      }
    }
  });

  useUpdateEffect(() => {
    if (ref.current) {
      if (open) {
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      } else {
        ref.current.style.height = `${ref.current.clientHeight}px`;
        setTimeout(() => {
          if (ref.current) ref.current.style.height = `${height}px`;
        }, 16);
      }
    }
  }, [open]);

  const handleTransitionEnd = usePersistFn(() => {
    if (ref.current) ref.current.style.height = open ? '' : `${height}px`;
  });
  return (
    <div
      ref={ref}
      className={`${px()} ${className}`}
      onTransitionEnd={handleTransitionEnd}
      style={{
        height: 0,
        ...style,
      }}
      {...otherProps}
    />
  );
});

export default OpenBox;
