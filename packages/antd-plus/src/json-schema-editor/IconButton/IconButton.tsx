import React from 'react';
import cn from 'classnames';
import useStyles from './IconButton.style';

export interface SimpleButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  size?: 'x-small' | 'small' | 'middle' | 'large';
  disabled?: boolean;
  theme?: 'default' | 'dark';
}

const IconButton = (props: SimpleButtonProps) => {
  const { className = '', size = 'middle', checked, disabled, theme = 'default', ...otherProps } = props;
  const styles = useStyles();
  return (
    <button
      type="button"
      className={cn(
        styles.root,
        styles[size],
        {
          [styles.disabled]: disabled,
          [styles.checked]: checked,
          [styles.dark]: theme === 'dark',
        },
        className,
      )}
      {...otherProps}
    />
  );
};

export default IconButton;
