import React, { useMemo } from 'react';
import pc from 'prefix-classnames';
import { useLocation } from 'react-router';
import { useControllableProps } from '@orca-fe/hooks';
import cn from 'classnames';
import type { MenuProps } from './Menu';
import Menu from './Menu';
import type { MenuItemType } from './menuUtils';
import { findSelectedMenu, findSelectedMenuIndexTraverse } from './menuUtils';
import { BreadCrumbProvider } from '../custom-breadcrumb/BreadcrumbContext';
import type { OpenKeysType } from './Menu/MenuContext';
import useStyles from './MenuLayout.style';

// 菜单展开按钮
const iconMenuPathExpand =
  'M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480' +
  'c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784' +
  'c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56' +
  'c0-4.4-3.6-8-8-8zM115.4 518.9L271.7 642c5.8 4.6 14.4.5 14.4-6.9V388.9c0-7.4-8.5-11.5-14.4-6.9L115.4 505.1a8.74 8.74 0 000 13.8z';

// 菜单收起按钮
const iconMenuPathCollapse =
  'M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480' +
  'c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784' +
  'c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56' +
  'c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 000-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0014.4 7z';

export interface MenuLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {

  /** 传入自定义的路径 */
  pathname?: string;

  /** 一级菜单所在位置 */
  mainMenuSide?: 'top' | 'left';

  /** 是否在顶部渲染一级菜单，当 mainMenuSide = left 时，该配置项不生效 */
  useTopMenu?: boolean;

  /** 菜单数据 */
  menu?: MenuItemType[];

  showHeader?: boolean;

  /** 顶栏的额外内容（最右侧） */
  headerExtra?: React.ReactNode;

  /** 自定义 logo */
  logo?: React.ReactNode;

  /** 自定义 大标题 */
  title?: React.ReactNode;

  /** 是否支持侧边菜单收起 */
  collapsible?: boolean;

  /** 是否侧边菜单收起 */
  collapse?: boolean;

  /** 侧边菜单收起事件 */
  onCollapseChange?: (collapse: boolean) => void;

  /** 顶栏的主题色 */
  themeHeader?: MenuProps['theme'];

  /** 侧边栏的主题色 */
  themeSide?: MenuProps['theme'];

  /** 菜单点击事件 */
  onItemClick?: MenuProps['onItemClick'];

  /** 默认展开的节点 */
  defaultOpenKeys?: string[] | OpenKeysType;

  /** 展开的节点 */
  openKeys?: string[] | OpenKeysType;

  /** 是否默认展开所有节点 */
  defaultOpenAll?: boolean;

  /** 节点展开事件 */
  onOpenKeysChange?: (openKeys: OpenKeysType) => void;

  /** 点击包含子菜单的项目时，强制开启 */
  toggleOnItemClick?: boolean;

  classPrefix?: string;

  /** 内部容器的 className */
  wrapperClassName?: string;

  /** 内部容器的 className */
  wrapperStyle?: React.CSSProperties;
}

const eArr = [];
const MenuLayout = (props: MenuLayoutProps) => {
  const { defaultOpenKeys: _defaultOpenKeys } = props;
  const [
    {
      className = '',
      wrapperClassName = '',
      wrapperStyle = {},
      menu = eArr,
      headerExtra,
      children,
      useTopMenu: _useTopMenu = true,
      toggleOnItemClick,
      collapsible = true,
      collapse: _collapse,
      showHeader = true,
      mainMenuSide = 'left',
      themeHeader = 'dark',
      themeSide = 'dark',
      title = 'Menu Layout',
      logo,
      pathname: _pathname,
      onItemClick,
      defaultOpenKeys,
      openKeys: _openKeys,
      classPrefix = 'orca-menu',
      defaultOpenAll = false,
      ...otherProps
    },
    changeProps,
  ] = useControllableProps(props, {
    collapse: false,
    openKeys: _defaultOpenKeys ?? [],
  });
  const styles = useStyles();

  const openKeys: OpenKeysType = useMemo(
    () =>
      Array.isArray(_openKeys)
        ? (() => {
          const res: OpenKeysType = {};
          _openKeys.forEach((key) => {
            res[key] = true;
          });
          return res;
        })()
        : _openKeys,
    [_openKeys],
  );

  const px = pc(`${classPrefix}-layout`);

  // 如果 collapsible 为 false，则一定不能收起
  const collapse = collapsible ? _collapse : false;

  const location = useLocation();
  // 判断取用哪个 pathname
  const pathname = _pathname != null ? _pathname : location.pathname;

  const checkedMenuIndex = useMemo(() => findSelectedMenuIndexTraverse(pathname, menu), [menu, pathname]);

  const checkedMenu = useMemo(() => findSelectedMenu(pathname, menu), [menu, pathname]);

  // 主菜单是否在左侧
  const mainSideLeft = mainMenuSide === 'left';

  // 是否使用顶部菜单？
  const useTopMenu = _useTopMenu && !mainSideLeft;

  let sideMenu = menu;
  // 如果包含顶部菜单，则侧边菜单为当前选中的一级菜单下的子菜单
  if (useTopMenu) {
    sideMenu = (checkedMenuIndex.length > 0 ? menu[checkedMenuIndex[0]].children : undefined) ?? [];
  }

  const headerCheckedKey = checkedMenuIndex.length > 0 ? menu[checkedMenuIndex[0]].key : undefined;

  const titleDiv = <div className={styles.title}>{title}</div>;

  const logoDiv = (
    <div
      className={cn(styles.logoContainer, {
        [styles.leftSide]: mainSideLeft,
      })}
    >
      <div className={styles.logo}>
        {logo || (
          <div
            style={{
              width: 30,
              height: 30,
              backgroundColor: 'rgba(125,125,125,0.3)',
              borderRadius: '50%',
            }}
          />
        )}
      </div>
      {titleDiv}
    </div>
  );

  // 侧边栏收缩按钮
  const collapseSwitchDiv = (
    <div className={styles.collapseHandle} onClick={() => changeProps({ collapse: !collapse })}>
      <svg
        className={cn(styles.collapseHandleIcon, {
          [styles.collapsed]: collapse,
        })}
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="menu"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={collapse ? iconMenuPathCollapse : iconMenuPathExpand} />
      </svg>
    </div>
  );

  /* 顶栏 */
  const header = (
    <div className={`${styles.header} ${px(`theme-${themeHeader}`)}`}>
      {/* 非侧边栏为主，顶栏需要显示logo */}
      {!mainSideLeft && logoDiv}
      {/* 侧边栏为主，且支持收缩时，显示 switch 按钮 */}
      {mainSideLeft && collapsible && collapseSwitchDiv}
      {useTopMenu && (
        <Menu
          classPrefix={classPrefix}
          className={styles.headerMenu}
          menu={menu}
          theme={themeHeader}
          checked={headerCheckedKey}
          toggleOnItemClick={toggleOnItemClick}
          onItemClick={onItemClick}
        />
      )}
      <div style={{ flex: 1 }} />
      {headerExtra}
    </div>
  );

  const matchedItem = checkedMenu.length ? checkedMenu[checkedMenu.length - 1] : undefined;
  const { style: itemStyle } = matchedItem || {};

  const content = (
    <div className={`${styles.content} ${wrapperClassName}`} style={{ ...wrapperStyle, ...itemStyle }}>
      {children}
    </div>
  );

  const sideMenuDiv = sideMenu.length > 0 && (
    <div
      className={cn(styles.sideMenuContainer, px(`theme-${themeSide}`), {
        [styles.topSplitter]: useTopMenu,
        [styles.collapsed]: collapse,
      })}
    >
      {/* 当侧边栏为主时，logo展示在 SideMenu 第一位 */}
      {mainSideLeft && logoDiv}
      {/* 非侧边栏为主，且支持收缩时，显示 switch 按钮 */}
      {!mainSideLeft && collapsible && collapseSwitchDiv}
      <Menu
        classPrefix={classPrefix}
        className={styles.sideMenu}
        collapsed={collapse}
        menu={sideMenu}
        theme={themeSide}
        checked={checkedMenu[checkedMenu.length - 1]?.key}
        toggleOnItemClick={toggleOnItemClick}
        direction="vertical"
        onItemClick={onItemClick}
        defaultOpenAll={defaultOpenAll}
        openKeys={openKeys}
        onOpenKeysChange={openKeys => changeProps({ openKeys })}
      />
    </div>
  );

  const center = (
    <div className={styles.center}>
      {/* showHeader == true 时，才渲染 header */}
      {mainSideLeft ? showHeader && header : sideMenuDiv}
      {content}
    </div>
  );

  return (
    <div
      className={`${cn(styles.root, {
        [styles.mainSideLeft]: mainSideLeft,
      })} ${className}`}
      {...otherProps}
    >
      <BreadCrumbProvider menu={menu} pathname={pathname}>
        {mainSideLeft ? sideMenuDiv : header}
        {center}
      </BreadCrumbProvider>
    </div>
  );
};

export default MenuLayout;
