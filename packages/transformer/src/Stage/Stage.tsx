import React, { useRef } from 'react';
import useStyles from './Stage.style';

export interface StageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {}

const Stage = (props: StageProps) => {
  const { className = '', ...otherProps } = props;
  const styles = useStyles();
  const rootRef = useRef<HTMLDivElement>(null);

  return <div ref={rootRef} className={`${styles.root} ${className}`} {...otherProps} />;
};

export default Stage;
