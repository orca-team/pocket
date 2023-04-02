import React from 'react';
import useStyles from './BorderSliceImg.style';

export interface BorderSliceImgProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  sliceTop?: number;
  sliceLeft?: number;
  sliceRight?: number;
  sliceBottom?: number;
  fill?: boolean;
  scale?: number;
}

const BorderSliceImg = React.forwardRef<HTMLDivElement, BorderSliceImgProps>((props, ref) => {
  const { className = '', src, style, scale = 1, fill = true, sliceBottom = 0, sliceLeft = 0, sliceRight = 0, sliceTop = 0, ...otherProps } = props;

  const styles = useStyles();
  return (
    <div
      ref={ref}
      className={`${styles.root} ${className}`}
      style={{
        ...style,
        borderImageSource: `url(${src})`,
        borderImageSlice: `${sliceTop} ${sliceRight} ${sliceBottom} ${sliceLeft} ${fill ? 'fill' : ''}`,
        borderWidth: `${sliceTop * scale}px ${sliceRight * scale}px ${sliceBottom * scale}px ${sliceLeft * scale}px`,
      }}
      {...otherProps}
    />
  );
});

export default BorderSliceImg;
