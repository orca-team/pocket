import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import pc from 'prefix-classnames';
import OpenBox from '../../../open-box';
import Trigger from 'rc-trigger';
import Animate from 'rc-animate';
import { MenuItemType } from '../../menuUtils';
import Arrow from '../Arrow';
import MenuContext from '../MenuContext';

const Span = ({
  visible,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & Record<string, unknown>) => (
  <span {...props} />
);

const px = pc('orca-menu-item');

const eArr = [];

const MenuLevelContext = React.createContext({
  level: 0,
  isInPopup: false,
});

export interface SubMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  menu: MenuItemType[];
  open?: boolean;
  isInPopup?: boolean;
  level?: number;
}

export const SubMenu = (props: SubMenuProps) => {
  const {
    className = '',
    level = 0,
    menu,
    open = false,
    isInPopup = false,
    ...otherProps
  } = props;
  const showIcon = useMemo(() => menu.some(({ icon }) => icon != null), [menu]);

  return (
    <MenuLevelContext.Provider value={{ level: level + 1, isInPopup }}>
      <OpenBox
        className={`orca-menu-sub-menu ${className}`}
        {...otherProps}
        open={open}
        height={0}
      >
        {menu.map((menu) => {
          const { key } = menu;
          return (
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            <MenuItem key={key} menu={menu} showIcon={showIcon} />
          );
        })}
      </OpenBox>
    </MenuLevelContext.Provider>
  );
};

export interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  menu: MenuItemType;
  // 显示icon占位符提示：由Menu计算得出，如果兄弟节点包含icon，则showIcon=true
  showIcon?: boolean;
}

const MenuItem = (props: MenuItemProps) => {
  const {
    className = '',
    menu,
    style,
    showIcon = false,
    ...otherProps
  } = props;
  const { children = eArr, key, path, render, text, icon } = menu;
  const hasChildren = children.length > 0;

  const {
    isVertical,
    openKeys,
    checkedKey,
    groupCheckedKeys,
    toggleOpenKey,
    collapsed,
    theme,
    onItemClick,
  } = useContext(MenuContext);
  const { level, isInPopup } = useContext(MenuLevelContext);
  const collapseAndZero = level === 0 && collapsed;

  const isOpen = useMemo(() => openKeys.includes(key), [openKeys, key]);
  const childChecked = useMemo(
    () => groupCheckedKeys.includes(key),
    [groupCheckedKeys, key],
  );
  const checked = key === checkedKey;
  const verticalAndParent = isVertical && hasChildren;

  function renderMenuTextContent() {
    // 是否展示icon：如果自身包含 icon 或垂直布局下被提示 showIcon 则展示 icon
    const isShowIcon = !!icon || (showIcon && isVertical);
    // 是否展示文本：如果不是 垂直布局 且被 collapsed，则展示文本
    const isShowText = !(isVertical && collapseAndZero);
    return (
      <>
        {isShowIcon && (
          <div className={px('icon', { collapsed: collapseAndZero })}>
            {icon}
          </div>
        )}
        <Animate
          className={px('text-anim-container')}
          showProp="visible"
          transitionName={px('text-anim')}
          transitionAppear
          transitionEnter
          transitionLeave
        >
          <Span
            className={px('text', { 'text-hidden': !isShowText })}
            visible={isShowText}
          >
            {text}
          </Span>
        </Animate>
        {verticalAndParent && !collapseAndZero && (
          <div
            className={px('arrow')}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // 下拉点击事件
              toggleOpenKey(key);
            }}
          >
            <Arrow down={isOpen} />
          </div>
        )}
      </>
    );
  }

  const handleItemClick = (e: React.MouseEvent) => {
    onItemClick(e, menu);
    if (!path) {
      toggleOpenKey(key);
    }
  };

  let paddingLeft = 24 * level + 20;
  if (collapsed && isInPopup && level > 0) {
    paddingLeft = 24 * (level - 1) + 20;
  }
  let menuText = path ? (
    <Link
      className={px('link')}
      to={path}
      style={{ paddingLeft }}
      onClick={handleItemClick}
    >
      {renderMenuTextContent()}
    </Link>
  ) : (
    <div
      className={px('link')}
      style={{ paddingLeft }}
      onClick={handleItemClick}
    >
      {renderMenuTextContent()}
    </div>
  );

  // 如果是最外层 且 包含 children 的菜单，则包裹 Trigger 备用
  if (verticalAndParent && level === 0) {
    menuText = (
      <Trigger
        prefixCls={px('popup')}
        popupClassName={px(`theme-${theme}`)}
        action={collapsed ? ['hover'] : []}
        popup={<SubMenu menu={children} level={level} open isInPopup />}
        popupAnimation="anim"
        mouseLeaveDelay={0.3}
        popupAlign={{
          points: ['tl', 'tr'],
          offset: [0, 0],
        }}
      >
        {menuText}
      </Trigger>
    );
  }

  return (
    <div
      className={`${px('root', `theme-${theme}`, {
        'child-checked': childChecked && !checked,
        checked,
        vertical: isVertical,
      })} ${className}`}
      {...otherProps}
    >
      {render?.({ checked })}
      {!render && menuText}
      {verticalAndParent && (
        <SubMenu
          menu={children}
          level={level}
          open={isOpen && !collapseAndZero}
          isInPopup={isInPopup}
        />
      )}
    </div>
  );
};
export default MenuItem;
