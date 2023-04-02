import React from 'react';
import cn from 'classnames';
import useStyles from './Arrow.style';

export interface ArrowProps extends React.HTMLAttributes<HTMLDivElement> {
  down?: boolean;
}

const Arrow = (props: ArrowProps) => {
  const { className = '', down, ...otherProps } = props;
  const styles = useStyles();
  return (
    <div className={`${cn(styles.root, { [styles.down]: down })} ${className}`} {...otherProps}>
      <div className={styles.before} />
      <div className={styles.after} />
    </div>
  );
};

export default Arrow;
