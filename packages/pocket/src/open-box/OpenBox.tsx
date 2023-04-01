import { useMount, usePersistFn, useUpdateEffect } from 'ahooks-v2';
import React, { useImperativeHandle, useRef } from 'react';
import useStyles from './OpenBox.style';

export interface OpenBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  defaultHeight?: string | number;
  height?: number;
}

const OpenBox: React.FC<OpenBoxProps> = React.forwardRef((props, pRef) => {
  const { className = '', open, height = 0, defaultHeight = 'auto', style, ...otherProps } = props;

  const styles = useStyles();

  const ref = useRef<HTMLDivElement>(null);
  useImperativeHandle(pRef, () => ref.current);

  useMount(() => {
    if (ref.current) {
      if (open) {
        if (defaultHeight === 'auto' || ref.current.scrollHeight === defaultHeight) {
          return;
        }
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      } else {
        ref.current.style.height = `${height}px`;
      }
    }
  });

  useUpdateEffect(() => {
    const dom = ref.current;
    if (dom) {
      if (open) {
        let { scrollHeight } = dom;
        if (dom.clientHeight >= scrollHeight && height >= scrollHeight) {
          // 如果展开高度和当前高度一样，则重新计算一次内部元素高度
          let top = Infinity;
          let bottom = -Infinity;
          for (const child of dom.children) {
            const bounds = child.getBoundingClientRect();
            top = Math.min(top, bounds.top);
            bottom = Math.max(bottom, bounds.top + bounds.height);
          }
          const contentHeight = bottom - top;
          // 更新目标高度
          if (contentHeight > 0 && contentHeight !== scrollHeight) {
            scrollHeight = contentHeight;
          }
        }
        ref.current.style.height = `${scrollHeight}px`;
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
      className={`${styles.root} ${className}`}
      onTransitionEnd={handleTransitionEnd}
      style={{
        height: defaultHeight,
        ...style,
      }}
      {...otherProps}
    />
  );
});

export default OpenBox;
