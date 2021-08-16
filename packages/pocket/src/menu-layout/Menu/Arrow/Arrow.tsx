import React from 'react';
import pc from 'prefix-classnames';

const px = pc('arrow');

export interface ArrowProps extends React.HTMLAttributes<HTMLDivElement> {
  down?: boolean;
}

const Arrow = (props: ArrowProps) => {
  const { className = '', down, ...otherProps } = props;
  return (
    <div className={`${px('root', { down })} ${className}`} {...otherProps}>
      <div className={px('before')} />
      <div className={px('after')} />
    </div>
  );
};

export default Arrow;
