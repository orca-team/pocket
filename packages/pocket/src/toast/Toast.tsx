import React, { useEffect, useState } from 'react';
import { useTimeout } from 'ahooks';
import { useMemorizedFn } from '@orca-fe/hooks';
import cn from 'classnames';
import { render } from '../utils/Portal';
import useStyles from './Toast.styles';

const ef = () => {};

interface ToastPropsOnly {
  centered?: boolean;
  duration?: number;
  afterClosed?: () => void;
}

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, ToastPropsOnly {}

const Toast = (props: ToastProps) => {
  const { className = '', duration = 2000, centered, afterClosed = ef, ...otherProps } = props;
  const styles = useStyles();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);

  useTimeout(() => {
    if (duration > 0) setVisible(false);
  }, duration);

  const handleTransitionEnd = useMemorizedFn(() => {
    if (!visible) {
      afterClosed();
    }
  });

  return (
    <div
      className={`${cn(styles.root, {
        [styles.hide]: !visible,
        [styles.centered]: centered,
      })} ${className}`}
      {...otherProps}
      onTransitionEnd={handleTransitionEnd}
    />
  );
};

Toast.infoTop = (info: string, options: ToastPropsOnly = {}) => {
  const { afterClosed = ef, ...otherProps } = options;
  const destroyToast = render(
    <Toast
      duration={300}
      {...otherProps}
      afterClosed={() => {
        destroyToast();
        afterClosed();
      }}
      style={{
        padding: '8px 20px',
        top: 50,
        bottom: 'auto',
        fontSize: '1.4em',
      }}
    >
      {info}
    </Toast>,
  );
  return destroyToast;
};

Toast.info = (info: string, options: ToastPropsOnly = {}) => {
  const { afterClosed = ef, ...otherProps } = options;
  const destroyToast = render(
    <Toast
      {...otherProps}
      afterClosed={() => {
        destroyToast();
        afterClosed();
      }}
    >
      {info}
    </Toast>,
  );
  return destroyToast;
};

export default Toast;
