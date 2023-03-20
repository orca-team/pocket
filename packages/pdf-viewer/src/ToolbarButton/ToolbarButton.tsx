import React from 'react';
import type { IconButtonProps } from '@orca-fe/pocket';
import { IconButton } from '@orca-fe/pocket';
import useStyles from './ToolbarButton.style';

export interface ToolbarButtonProps extends IconButtonProps {
  icon?: React.ReactNode;
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>((props, ref) => {
  const { className = '', icon, children, ...otherProps } = props;
  const styles = useStyles();
  return (
    <IconButton ref={ref} autoWidth className={`${styles.root} ${className}`} {...otherProps}>
      <div className={styles.icon}>{icon}</div>
      {children && <span className={styles.text}>{children}</span>}
    </IconButton>
  );
});

ToolbarButton.displayName = 'ToolbarButton';

export default ToolbarButton;
