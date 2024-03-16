import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { createPortal } from 'react-dom';
import { useMount } from 'ahooks';
import useStyles from './ScreenCover.style';

export interface ScreenCoverProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {

  /** 是否可见 */
  open?: boolean;

  /** 是否展示遮罩 */
  mask?: boolean;

  /** 是否锁定 body 滚动 */
  bodyScrollLock?: boolean;

  /** 设置 z-index */
  zIndex?: number;
}

const ScreenCover = (props: ScreenCoverProps) => {
  const { className = '', open, mask = true, bodyScrollLock = false, zIndex = 1000, children, style = {}, ...otherProps } = props;
  const styles = useStyles();
  const [_this] = useState<{ cachedOverflowY?: string }>({});

  const node = (
    <div className={cn(styles.root, className, { [styles.show]: open, [styles.mask]: mask })} style={{ zIndex, ...style }} {...otherProps}>
      <div className={styles.content}>{children}</div>
    </div>
  );

  useEffect(() => {
    if (!bodyScrollLock) return;
    if (open) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = _this.cachedOverflowY ?? '';
    }
  }, [open, bodyScrollLock]);

  useMount(() => {
    _this.cachedOverflowY = document.body.style.overflowY;
  });

  return bodyScrollLock ? createPortal(node, document.body, 'ScreenCover') : node;
};

export default ScreenCover;
