import type { CSSProperties } from 'react';
import React, { useEffect, useMemo, useRef } from 'react';
import { useSize } from 'ahooks';
// import './EqRatioBox.less';

export interface EqRatioBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  mode?: 'contain' | 'cover';
  xAlign?: 'left' | 'right' | 'center';
  yAlign?: 'top' | 'bottom' | 'center';
  scaleMode?: boolean;
  onRatioChange?: (ratio: number) => void;
}

const ef = () => {};

const EqRatioBox = (props: EqRatioBoxProps) => {
  const {
    className = '',
    width,
    height,
    mode = 'contain',
    xAlign = 'center',
    yAlign = 'center',
    scaleMode = true,
    onRatioChange = ef,
    children,
    ...otherProps
  } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth = width, height: containerHeight = height } =
    useSize(rootRef);

  const { ratio, ...style } = useMemo(() => {
    const fn = mode === 'contain' ? Math.min : Math.max;
    const ratio = fn(containerWidth / width, containerHeight / height);
    const contentWidth = scaleMode ? width : ratio * width;
    const contentHeight = scaleMode ? height : ratio * height;
    let left = 0.5 * (containerWidth - ratio * width);
    let top = 0.5 * (containerHeight - ratio * height);
    if (mode === 'contain') {
      if (xAlign === 'left') left = 0;
      if (xAlign === 'right') left *= 2;
      if (yAlign === 'top') top = 0;
      if (yAlign === 'bottom') top *= 2;
    }
    if (mode === 'cover') {
      if (xAlign === 'left') left = 0;
      if (xAlign === 'right') left *= 2;
      if (yAlign === 'top') top = 0;
      if (yAlign === 'bottom') top *= 2;
    }

    return {
      ratio,
      position: 'absolute',
      transformOrigin: 'top left',
      transform: scaleMode ? `scale(${ratio})` : '',
      top,
      left,
      width: contentWidth,
      height: contentHeight,
    };
  }, [containerWidth, containerHeight, width, height, xAlign, yAlign, mode]);

  useEffect(() => {
    onRatioChange(ratio);
  }, [ratio]);

  return (
    <div className={`eq-ratio-box ${className}`} ref={rootRef} {...otherProps}>
      <div className="eq-ratio-box-content" style={style as CSSProperties}>
        {children}
      </div>
    </div>
  );
};

export default EqRatioBox;
