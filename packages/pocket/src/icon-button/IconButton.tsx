import React from 'react';
import cn from 'classnames';
import useStyles from './IconButton.style';

export interface IconButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  size?: 'x-small' | 'small' | 'middle' | 'large';
  disabled?: boolean;
  theme?: 'default' | 'dark';
  autoWidth?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const styles = useStyles();
    const {
      className = '',
      size = 'middle',
      checked,
      disabled,
      theme = 'default',
      autoWidth,
      ...otherProps
    } = props;
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          styles.root,
          styles[size],
          {
            [styles.disabled]: disabled,
            [styles.checked]: checked,
            [styles.autoWidth]: autoWidth,
            [styles.dark]: theme === 'dark',
          },
          className,
        )}
        {...otherProps}
      />
    );
  },
);

export default IconButton;
