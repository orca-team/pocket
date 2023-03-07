import React from 'react';
import useStyle from './Painter.style';

export interface PainterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Painter = (props: PainterProps) => {
  const { className = '', ...otherProps } = props;
  const styles = useStyle();
  return (
    <div className={`${styles.root} ${className}`} {...otherProps}>
      Painter
    </div>
  );
};

export default Painter;
