import React, { useEffect, useState } from 'react';
import { useTimeout } from 'ahooks';
import pc from 'prefix-classnames';
import './Toast.less';
import { useMemorizedFn } from '@orca-fe/hooks';
import { render } from '../utils/Portal';

const px = pc('orca-toast');

const ef = () => {};

interface ToastPropsOnly {
  centered?: boolean;
  duration?: number;
  afterClosed?: () => void;
}

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ToastPropsOnly {}

const Toast = (props: ToastProps) => {
  const {
    className = '',
    duration = 2000,
    centered,
    afterClosed = ef,
    ...otherProps
  } = props;
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
      className={`${px('root', {
        hide: !visible,
        centered,
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
