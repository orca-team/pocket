import React, { useMemo } from 'react';
import pc from 'prefix-classnames';
import { useControllableProps } from '@orca-fe/hooks';
import { MenuItemType } from '../menuUtils';
import MenuItem from './MenuItem';
import { MenuContextBaseType, MenuProvider } from './MenuContext';

const px = pc('orca-menu');

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  menu?: MenuItemType[];
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
}

const eArr: any[] = [];
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
      ...otherProps
    },
    changeProps,
  ] = useControllableProps(props, {
    openKeys: eArr as string[],
  });
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
      onOpenKeysChange={(openKeys) => {
        changeProps({ openKeys });
      }}
    >
      <div
        className={`${px('root', `theme-${theme}`, direction)} ${className}`}
        {...otherProps}
      >
        {menu.map((menu) => {
          const { key } = menu;
          return <MenuItem key={key} menu={menu} showIcon={showIcon} />;
        })}
      </div>
    </MenuProvider>
  );
};

export default Menu;
