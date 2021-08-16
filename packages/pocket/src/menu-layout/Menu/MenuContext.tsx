import React, { useMemo } from 'react';
import { usePersistFn } from 'ahooks';
import { findSelectedMenuKey, MenuItemType } from '../menuUtils';

export interface MenuContextBaseType {
  checkedKey: string;
  openKeys: string[];
  isVertical: boolean;
  collapsed: boolean;
  theme: string;
  onItemClick: (event: React.MouseEvent, menuInfo: MenuItemType) => void;
}

export interface MenuContextType extends MenuContextBaseType {
  groupCheckedKeys: string[];
  toggleOpenKey: (key: string) => void;
}

const MenuContext = React.createContext<MenuContextType>({
  checkedKey: '',
  groupCheckedKeys: [],
  openKeys: [],
  isVertical: false,
  collapsed: false,
  toggleOpenKey: () => {},
  onItemClick: () => {},
  theme: '',
});

export default MenuContext;

export interface MenuProviderProps extends MenuContextBaseType {
  menu: MenuItemType[];
  onOpenKeysChange: (
    openKeys: string[],
    changedKey: string,
    isOpen: boolean,
  ) => void;
  children: React.ReactNode;
}

export const MenuProvider = (props: MenuProviderProps) => {
  const { children, onOpenKeysChange, menu, ...otherProps } = props;
  const { checkedKey } = otherProps;
  const allCheckedKeys = useMemo(
    () => findSelectedMenuKey(checkedKey, menu, 'key'),
    [menu, checkedKey],
  );

  const toggleOpenKey = usePersistFn((key: string) => {
    const { openKeys } = otherProps;
    let has = false;
    const newOpenKeys = openKeys.filter((k) => {
      if (k === key) {
        has = true;
        return false;
      }
      return true;
    });
    if (has) {
      onOpenKeysChange(newOpenKeys, key, false);
    } else {
      onOpenKeysChange([...openKeys, key], key, true);
    }
  });
  return (
    <MenuContext.Provider
      value={{ ...otherProps, toggleOpenKey, groupCheckedKeys: allCheckedKeys }}
    >
      {children}
    </MenuContext.Provider>
  );
};
