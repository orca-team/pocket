import type { ForwardedRef, ReactNode, RefObject } from 'react';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import { useBoolean, useClickAway, useEventListener } from 'ahooks';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { useMergedRefs } from '@orca-fe/hooks';
import useStyles from './ContextMenu.style';

const arrowPath =
  // eslint-disable-next-line max-len
  'M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z';

const ef = () => {};

export type Bounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const emptyBounds: Bounds = {
  top: 0,
  left: 0,
  width: 1,
  height: 1,
};

export type ContextMenuItemType = {
  key: string;
  text: ReactNode;
  children?: ContextMenuItemWithSplitType[];
  disabled?: boolean;
  icon?: ReactNode;
  extra?: ReactNode;
  onClick?: (e: React.MouseEvent) => any;
};
export type ContextMenuItemWithSplitType = ContextMenuItemType | 'split-line';

const eArr = [];
const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0, pointerEvents: 'none' },
};

export type MenuItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> &
  Omit<ContextMenuItemType, 'key'> & {
    menuKey: string;
    hasIcon?: boolean;
    onMenuClick?: (menu: ContextMenuItemType, event: React.MouseEvent) => void;
  };

export const MenuItem = (props: MenuItemProps) => {
  const { className = '', text, menuKey, children = eArr, disabled, icon, extra, hasIcon, onMenuClick = ef, ...otherProps } = props;
  const styles = useStyles();
  const rootRef = useRef<HTMLDivElement>(null);
  const hasChildren = Array.isArray(children) && children.length > 0;
  const [showSubMenu, { setFalse, setTrue }] = useBoolean(false);

  const bounds = useMemo(() => {
    const { current: dom } = rootRef;
    if (hasChildren && dom) {
      const bounds = dom.getBoundingClientRect();
      return {
        top: bounds.top,
        height: bounds.height,
        width: bounds.width - 20,
        left: bounds.left + 20,
      };
    }
    return undefined;
  }, [showSubMenu]);

  return (
    <div
      ref={rootRef}
      className={`${cn(styles.item, { [styles.disabled]: disabled })} ${className}`}
      {...otherProps}
      onMouseEnter={setTrue}
      onMouseLeave={setFalse}
    >
      {hasIcon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.text}>{text}</div>
      {extra && <div className={styles.extra}>{extra}</div>}
      {hasChildren && (
        <div className={styles.arrow}>
          <svg viewBox="64 64 896 896" version="1.1" focusable={false} xmlns="http://www.w3.org/2000/svg" style={{ width: '1em', height: '1em' }}>
            <path d={arrowPath} />
          </svg>
        </div>
      )}
      {hasChildren && bounds && showSubMenu && (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <MenuContainer data={children} bounds={bounds} onMenuClick={onMenuClick} />
      )}
    </div>
  );
};

export interface MenuContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  bounds?: Bounds;
  data?: ContextMenuItemWithSplitType[];
  onMenuClick?: (menu: ContextMenuItemType, event: React.MouseEvent) => void;
}

export const MenuContainer = (props: MenuContainerProps) => {
  const { className = '', data = eArr, bounds = emptyBounds, onMenuClick = ef, style, ...otherProps } = props;
  const styles = useStyles();
  const hasIcon = data.some(item => typeof item === 'object' && item.icon != null);

  const rootRef = useRef<HTMLDivElement>(null);
  const [h, setH] = useState<'left' | 'right'>('right');
  const [v, setV] = useState<'top' | 'bottom'>('bottom');

  useEffect(() => {
    const { current: dom } = rootRef;
    if (dom) {
      const { width, height } = dom.getBoundingClientRect();
      const _h = bounds.left + bounds.width + width > window.innerWidth ? 'left' : 'right';
      const _v = bounds.top + height > window.innerHeight ? 'top' : 'bottom';
      if (_h !== h) {
        setH(_h);
      }
      if (_v !== v) {
        setV(_v);
      }
    }
  }, [bounds]);

  const fixedStyle = useMemo(() => {
    const style: React.CSSProperties = {};
    if (h === 'left') {
      style.right = Math.min(window.innerWidth - bounds.left, window.innerWidth - bounds.width);
    } else {
      style.left = bounds.left + bounds.width;
    }
    if (v === 'top') {
      style.bottom = Math.min(window.innerHeight - bounds.top - bounds.height, window.innerHeight - bounds.height);
    } else {
      style.top = bounds.top;
    }
    return style;
  }, [h, v, bounds]);

  return (
    <div ref={rootRef} className={`${styles.container} ${className}`} {...otherProps} style={{ ...style, ...fixedStyle }}>
      {data.map((item, index) =>
        item === 'split-line' ? (
          <div key={index} className={styles.splitLine} />
        ) : (
          <MenuItem
            menuKey={item.key}
            hasIcon={hasIcon}
            {...item}
            onMenuClick={onMenuClick}
            onClick={(event) => {
              event.stopPropagation();
              if (Array.isArray(item.children)) return;
              if (!item.disabled) {
                onMenuClick(item, event);
                item.onClick?.(event);
              }
            }}
            key={index}
          />
        ),
      )}
    </div>
  );
};

export interface ContextMenuProps<T extends ContextMenuItemType> extends React.HTMLAttributes<HTMLDivElement> {
  data?: (T | 'split-line')[] | ((el: HTMLElement | null) => (T | 'split-line')[]);
  onMenuClick?: (menu: T, event: React.MouseEvent) => void;
  getContainer?: (element: HTMLElement) => HTMLElement;
  menuContainerClassName?: string;
  mainMenuMinWidth?: number;
  wrapperStyle?: React.CSSProperties;
  disabled?: boolean;
  ref?: RefObject<HTMLDivElement>;
}

const ContextMenu = <T extends ContextMenuItemType>(props: ContextMenuProps<T>, pRef: ForwardedRef<HTMLDivElement>) => {
  const {
    className = '',
    data = eArr,
    children,
    onMenuClick = ef,
    getContainer = ef,
    menuContainerClassName = '',
    mainMenuMinWidth = 300,
    wrapperStyle,
    disabled,
    ...otherProps
  } = props;
  const styles = useStyles();
  const triggerTarget = useRef(document.body);
  const [position, setPosition] = useState<
    | {
        left: number;
        top: number;
      }
    | undefined
  >();
  const [_this] = useState({
    lastTriggerElement: null as HTMLElement | null,
  });

  const [visible, setVisible] = useState(false);

  const bounds = useMemo(
    () =>
      position
        ? {
          ...position,
          width: 1,
          height: 1,
        }
        : undefined,
    [position],
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, pRef);

  // hide menu
  useClickAway(() => {
    if (visible) {
      setVisible(false);
      _this.lastTriggerElement = null;
    }
  }, menuRef);

  useEventListener(
    'contextmenu',
    (event: MouseEvent) => {
      // check is prevented
      if (event.defaultPrevented) {
        if (visible) {
          setVisible(false);
          _this.lastTriggerElement = null;
        }
        return;
      }
      if (disabled) return;
      if (event.shiftKey) return;
      event.preventDefault();
      if (event.target instanceof HTMLElement) {
        triggerTarget.current = event.target;
      }
      const { clientX, clientY } = event;
      setPosition({
        left: clientX,
        top: clientY,
      });
      setVisible(true);
      _this.lastTriggerElement = event.target as HTMLElement;
    },
    { target: rootRef },
  );

  useEventListener('contextmenu', (event) => {
    if (menuRef.current?.contains(event.target as Node)) {
      return;
    }
    // check is container
    if (!rootRef.current?.contains(event.target as Node)) {
      setVisible(false);
      _this.lastTriggerElement = null;
    }
  });

  return (
    <div ref={mergedRef} className={`${styles.root} ${className}`} {...otherProps}>
      {children}
      <Transition key={`${position?.left},${position?.top}`} appear unmountOnExit in={visible && bounds != null} timeout={300}>
        {state =>
          ReactDOM.createPortal(
            <div
              ref={menuRef}
              className={styles.wrapper}
              style={{
                ...transitionStyles[state],
                ...wrapperStyle,
              }}
            >
              <MenuContainer
                className={menuContainerClassName}
                bounds={bounds}
                data={typeof data === 'function' ? data(_this.lastTriggerElement) : data}
                style={{ minWidth: mainMenuMinWidth }}
                onMenuClick={(item, e) => {
                  onMenuClick(item as T, e);
                  setVisible(false);
                  _this.lastTriggerElement = null;
                }}
              />
            </div>,
            getContainer(triggerTarget.current) ?? document.body,
          )}
      </Transition>
    </div>
  );
};

export default forwardRef(ContextMenu) as typeof ContextMenu;
