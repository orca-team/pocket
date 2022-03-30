import React, { useMemo } from 'react';
import pc from 'prefix-classnames';
import { useControllableProps } from '@orca-fe/hooks';
import { MenuItemType } from '../menuUtils';
import MenuItem from './MenuItem';
import { MenuContextBaseType, MenuProvider } from './MenuContext';

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  menu?: MenuItemType[];
  classPrefix?: string;
  checked?: string;
  direction?: 'vertical' | 'horizontal';
  openKeys?: string[];
  onOpenKeysChange?: (
    openKeys: string[],
    currentChange: string,
    isOpen: boolean,
  ) => void;
  collapsed?: boolean;
  onItemClick?: MenuContextBaseType['onItemClick'];
  theme?: 'light' | 'dark' | string;
  toggleOnItemClick?: boolean;
}

const eArr = [];
const ef = () => {};

const Menu = (props: MenuProps) => {
  const [
    {
      className = '',
      menu = eArr,
      checked = '',
      direction = 'horizontal',
      openKeys = eArr,
      onOpenKeysChange,
      collapsed = false,
      theme = 'dark',
      onItemClick = ef,
      classPrefix = 'orca-menu',
      toggleOnItemClick = false,
      ...otherProps
    },
    changeProps,
  ] = useControllableProps(props, {
    openKeys: eArr as string[],
  });

  const px = pc(classPrefix);

  const isVertical = direction === 'vertical';
  const showIcon = useMemo(() => menu.some(({ icon }) => icon != null), [menu]);
  return (
    <MenuProvider
      isVertical={isVertical}
      openKeys={openKeys}
      checkedKey={checked}
      theme={theme}
      menu={menu}
      collapsed={collapsed}
      onItemClick={onItemClick}
      toggleOnItemClick={toggleOnItemClick}
      onOpenKeysChange={(openKeys) => {
        changeProps({ openKeys });
      }}
    >
      <div
        className={`${px('root', `theme-${theme}`, direction)} ${className}`}
        {...otherProps}
      >
        {menu.map((menu, index) => {
          const { key, visible } = menu;
          return (
            visible !== false && (
              <MenuItem
                key={key || `menu-item-${index}`}
                menu={menu}
                showIcon={showIcon}
              />
            )
          );
        })}
      </div>
    </MenuProvider>
  );
};

export default Menu;
