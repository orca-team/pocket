import React from 'react';
import useStyles from './PopupBox.style';

export interface PopupBoxProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange'
  > {}

const PopupBox = (props: PopupBoxProps) => {
  const { className = '', ...otherProps } = props;
  const styles = useStyles();
  return <div className={`${styles.root} ${className}`} {...otherProps} />;
};

export default PopupBox;
