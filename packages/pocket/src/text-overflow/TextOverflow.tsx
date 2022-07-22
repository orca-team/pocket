import React, { useRef } from 'react';
import pc from 'prefix-classnames';
import { useSizeListener } from '@orca-fe/hooks';

const px = pc('text-overflow');

export interface TextOverflowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right';
  pauseOnHover?: boolean;
  contentStyle?: React.CSSProperties;
}

const TextOverflow = (props: TextOverflowProps) => {
  const {
    className = '',
    children,
    align = 'left',
    pauseOnHover = true,
    contentStyle,
    ...otherProps
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useSizeListener((size) => {
    const root = rootRef.current;
    const placeholder = placeholderRef.current;
    const textWrapper = textWrapperRef.current;
    const text = textRef.current;
    if (root && textWrapper && text && placeholder) {
      const rootWidth = root.clientWidth;
      const textWidth = text.clientWidth;
      const isOverflow = textWidth > rootWidth;

      const width = Math.max(0, textWidth - rootWidth);
      textWrapper.style.width = `${width}px`;
      textWrapper.style.animationDuration = `${
        4000 + Math.round(width / 100) * 5000
      }ms`;

      if (!isOverflow) {
        if (align === 'left') {
          textWrapper.style.left = '0';
        }
        if (align === 'center') {
          textWrapper.style.left = `${0.5 * (rootWidth - textWidth)}px`;
        }
        if (align === 'right') {
          textWrapper.style.left = `${rootWidth - textWidth}px`;
        }
      } else {
        textWrapper.style.left = '';
      }
      textWrapper.style.visibility = 'visible';
      placeholder.style.visibility = 'hidden';
    }
  }, rootRef);

  return (
    <div
      ref={rootRef}
      key={typeof children === 'string' ? children : '-'}
      className={`${px('root', {
        'pause-on-hover': pauseOnHover,
      })} ${className}`}
      {...otherProps}
    >
      <div
        ref={placeholderRef}
        className={px('place-holder')}
        style={contentStyle}
      >
        {children}
      </div>
      <div ref={textWrapperRef} className={px('text-wrapper')}>
        <div ref={textRef} className={px('text')} style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default TextOverflow;
