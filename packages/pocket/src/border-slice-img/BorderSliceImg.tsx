import React from 'react';
import pc from 'prefix-classnames';

const px = pc('border-slice-img');

export interface BorderSliceImgProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  sliceTop?: number;
  sliceLeft?: number;
  sliceRight?: number;
  sliceBottom?: number;
  fill?: boolean;
  scale?: number;
}

const BorderSliceImg = (props: BorderSliceImgProps) => {
  const {
    className = '',
    src,
    style,
    scale = 1,
    fill = true,
    sliceBottom = 0,
    sliceLeft = 0,
    sliceRight = 0,
    sliceTop = 0,
    ...otherProps
  } = props;
  return (
    <div
      className={`${px('root')} ${className}`}
      style={{
        ...style,
        borderImageSource: `url(${src})`,
        borderImageSlice: `${sliceTop} ${sliceRight} ${sliceBottom} ${sliceLeft} ${
          fill ? 'fill' : ''
        }`,
        borderWidth: `${sliceTop * scale}px ${sliceRight * scale}px ${
          sliceBottom * scale
        }px ${sliceLeft * scale}px`,
      }}
      {...otherProps}
    />
  );
};

export default BorderSliceImg;
