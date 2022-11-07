import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import pc from 'prefix-classnames';
import { CloseOutlined } from '@ant-design/icons';
import IconButton from '../icon-button';

const px = pc('orca-dialog');

export interface DialogProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 是否展示 */
  show?: boolean;

  /** 标题 */
  title?: React.ReactNode;

  /** 对话框宽度 */
  width?: number | string;

  /** 对话框高度 */
  height?: number | string;

  /** 默认居中显示 */
  defaultShowCenter?: boolean;

  getContainer?: () => HTMLElement;
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const {
    className = '',
    style,
    show,
    title = '标题',
    width = 600,
    height = 400,
    defaultShowCenter,
    getContainer = () => document.body,
    children,
    ...otherProps
  } = props;

  const showRef = useRef(false);

  if (show) {
    showRef.current = show;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!showRef.current) return <>{null}</>;
  return ReactDOM.createPortal(
    <div
      ref={ref}
      className={`${px('root')} ${className}`}
      style={{
        ...style,
        width,
        height,
      }}
      {...otherProps}
    >
      <div className={px('header')}>
        <div className={px('title')}>{title}</div>
        <div className={px('buttons')}>
          <IconButton size="small">
            <CloseOutlined />
          </IconButton>
        </div>
      </div>
      <div className={px('body')}>{children}</div>
      <div className={px('footer')} />
    </div>,
    getContainer(),
  );
});

export default Dialog;
