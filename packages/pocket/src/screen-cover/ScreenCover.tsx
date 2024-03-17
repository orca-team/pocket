import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { createPortal } from 'react-dom';
import { useMemoizedFn } from 'ahooks';
import setStyle from 'rc-util/es/setStyle';
import { isNumber } from 'lodash-es';
import useStyles from './ScreenCover.style';

export type ScreenCoverContentPosition = {
  top?: number | string;

  left?: number | string;
};

const contentPos = (pos?: number | string) => (isNumber(pos) ? `${pos}px` : pos);

export interface ScreenCoverProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {

  /** 是否可见 */
  visible?: boolean;

  /** 是否展示遮罩 */
  mask?: boolean;

  /** 是否锁定 body 滚动，true-全部锁定，false-不锁定 */
  bodyScrollLock?: boolean | 'x' | 'y';

  /** 内容位置 */
  position?: ScreenCoverContentPosition;

  /** 设置 z-index */
  zIndex?: number;
}

const ScreenCover = (props: ScreenCoverProps) => {
  const {
    className = '',
    visible = false,
    mask = true,
    bodyScrollLock = true,
    position = {},
    zIndex = 1000,
    children,
    style = {},
    ...otherProps
  } = props;
  const styles = useStyles();
  const [_this] = useState<{ oldBodyStyle?: CSSProperties }>({});

  const node = (
    <div className={cn(styles.root, className, { [styles.show]: visible, [styles.mask]: mask })} style={{ zIndex, ...style }} {...otherProps}>
      <div className={styles.content} style={{ top: contentPos(position.top), left: contentPos(position.left) }}>
        {children}
      </div>
    </div>
  );

  const lockBody = useMemoizedFn(() => {
    const oldBodyStyle = setStyle(
      {
        overflow: bodyScrollLock === true ? 'hidden' : undefined,
        overflowX: bodyScrollLock === 'x' ? 'hidden' : undefined,
        overflowY: bodyScrollLock === 'y' ? 'hidden' : undefined,
      },
      { element: document.body },
    );
    _this.oldBodyStyle = oldBodyStyle;
  });

  const unlockBody = useMemoizedFn(() => {
    setStyle(_this.oldBodyStyle ?? {}, { element: document.body });
    _this.oldBodyStyle = undefined;
  });

  useEffect(() => {
    if (!bodyScrollLock) return;

    if (visible) {
      lockBody();
    } else {
      unlockBody();
    }
  }, [visible, bodyScrollLock]);

  return createPortal(node, document.body, 'ScreenCover');
};

export default ScreenCover;
