import type { CSSProperties } from 'react';
import React, { useEffect, useMemo, useRef } from 'react';
import { useSize } from 'ahooks-v2';
import useStyles from './EqRatioBox.style';
import EqRatioBoxContext, { useRatio } from './EqRatioBoxContext';

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
  const styles = useStyles();
  const rootRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useSize(rootRef);

  const hasSize = containerWidth != null && containerHeight != null;

  const { ratio, ...style } = useMemo(() => {
    if (!hasSize) {
      return {
        ratio: 0,
      };
    }
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
      top: Math.round(top),
      left: Math.round(left),
      width: Math.round(contentWidth),
      height: Math.round(contentHeight),
    };
  }, [containerWidth, containerHeight, width, height, xAlign, yAlign, mode]);

  useEffect(() => {
    if (ratio) {
      onRatioChange(ratio);
    }
  }, [ratio]);

  return (
    <div className={`${styles.root} ${className}`} ref={rootRef} {...otherProps}>
      <div className="eq-ratio-box-content" style={style as CSSProperties}>
        {hasSize && <EqRatioBoxContext.Provider value={{ ratio }}>{children}</EqRatioBoxContext.Provider>}
      </div>
    </div>
  );
};

EqRatioBox.useRatio = useRatio;

EqRatioBox.EqRatioBoxContext = EqRatioBoxContext;

export default EqRatioBox;
