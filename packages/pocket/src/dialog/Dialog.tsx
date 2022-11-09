import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import pc from 'prefix-classnames';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useDebounceFn, useEventListener } from 'ahooks';
import { isInBy } from '../utils/isIn';
import useDraggable from './useDraggable';

const px = pc('orca-dialog');

const ef = () => {};

export interface DialogProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 是否展示 */
  open?: boolean;

  /** 标题 */
  title?: React.ReactNode;

  /** 居中展示 */
  center?: boolean;

  /** 对话框 top */
  top?: number;

  /** 对话框 left */
  left?: number;

  /** 对话框宽度 */
  width?: number;

  /** 对话框高度 */
  height?: number;

  /** 默认居中显示 */
  getContainer?: () => HTMLElement;

  /** 关闭/取消事件回调 */
  onClose?: () => void;

  /** 完全关闭后的回调 */
  afterClose?: () => void;

  destroyOnClose?: boolean;

  /** 确定事件回调 */
  onOk?: () => void;

  /** 强制渲染弹框 */
  forceRender?: boolean;

  /** 对话框脚部内容的对齐方向 */
  footerAlign?: 'left' | 'right' | 'center';

  /** 自定义对话框脚部 */
  footer?: React.ReactNode;

  /** 对话框内容部分是否可滚动，你可以设置为不滚动，并自己实现滚动条 */
  scrollable?: boolean;

  /** 弹框尺寸 */
  size?: 'large' | 'middle' | 'small';

  /** 弹框 z-index 高度 */
  zIndex?: number;
}

const Dialog = (props: DialogProps) => {
  const {
    className = '',
    style,
    open = false,
    title = '标题',
    center = true,
    left = 100,
    top = 100,
    width = 600,
    height = 400,
    getContainer = () => document.body,
    children,
    forceRender = false,
    onOk = ef,
    onClose = ef,
    afterClose = ef,
    footer,
    footerAlign = 'right',
    scrollable = true,
    destroyOnClose,
    size = 'large',
    zIndex,
    ...otherProps
  } = props;

  const [openRef, setOpenRef] = useState({ value: forceRender });
  const [dragging, setDragging] = useState(false);
  const [show, setShow] = useState(false);

  const [{ centerLeft, centerTop }] = useState(() => ({
    centerLeft: Math.round(0.5 * (window.innerWidth - width)),
    centerTop: Math.round(0.5 * (window.innerHeight - height)),
  }));

  const triggerAfterClose = useDebounceFn(
    () => {
      if (destroyOnClose) {
        setOpenRef({ value: false });
      }
      afterClose();
    },
    { wait: 100 },
  );

  const rootRef = useRef<HTMLDivElement>(null);

  useEventListener(
    'transitionend',
    (e) => {
      if (e.target === e.currentTarget) {
        if (!show) {
          triggerAfterClose.run();
        } else {
          triggerAfterClose.cancel();
        }
      }
    },
    { target: rootRef },
  );

  const [{ rootProps, handleProps }] = useDraggable({
    defaultY: center ? centerTop : top,
    defaultX: center ? centerLeft : left,
    customHandler: true,
    onDragStart() {
      setDragging(true);
    },
    onDragEnd() {
      setDragging(false);
    },
  });

  if (open) {
    openRef.value = open;
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setShow(open);
      }, 0);
    } else {
      setShow(open);
    }
  }, [open]);

  const triggerOk = () => {
    onOk();
  };
  const triggerClose = () => {
    onClose();
  };

  const defaultFooter = (
    <Space>
      <Button
        size={size === 'small' ? 'small' : 'middle'}
        onClick={triggerClose}
      >
        取消
      </Button>
      <Button
        size={size === 'small' ? 'small' : 'middle'}
        type="primary"
        onClick={triggerOk}
      >
        确定
      </Button>
    </Space>
  );

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!openRef.value) return <>{null}</>;
  return ReactDOM.createPortal(
    <span
      className={px('wrapper', { hidden: !show })}
      style={{ zIndex }}
      {...rootProps}
    >
      <div
        ref={rootRef}
        className={`${px('root', `size-${size}`, { dragging })} ${className}`}
        style={{
          ...style,
          width,
          height,
        }}
        {...otherProps}
      >
        <div
          {...handleProps}
          className={px('header')}
          onMouseDown={(e) => {
            if (
              isInBy(
                e.target as HTMLElement,
                (node) => node.tagName === 'BUTTON',
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <div className={px('title')}>{title}</div>
          <div className={px('buttons')}>
            <div
              className={px('button', 'button-danger')}
              onClick={triggerClose}
            >
              <CloseOutlined />
            </div>
          </div>
        </div>
        <div className={px('body', { scrollable })}>{children}</div>
        <div className={px('footer')} style={{ textAlign: footerAlign }}>
          {footer !== undefined ? footer : defaultFooter}
        </div>
      </div>
    </span>,
    getContainer(),
  );
};

export default Dialog;
