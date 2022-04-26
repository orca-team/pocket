import React, { useMemo } from 'react';
import { useMemorizedFn } from '@orca-fe/hooks';
import { findSelectedMenuKey, MenuItemType } from '../menuUtils';

export type OpenKeysType = Record<string, boolean | undefined>;

export interface MenuContextBaseType {
  checkedKey: string;
  defaultOpenAll: boolean;
  openKeys: OpenKeysType;
  isVertical: boolean;
  collapsed: boolean;
  theme: string;
  onItemClick: (event: React.MouseEvent, menuInfo: MenuItemType) => void;
  toggleOnItemClick: boolean;
}

export interface MenuContextType extends MenuContextBaseType {
  groupCheckedKeys: string[];
  toggleOpenKey: (key: string) => void;
}

const MenuContext = React.createContext<MenuContextType>({
  checkedKey: '',
  defaultOpenAll: false,
  groupCheckedKeys: [],
  openKeys: {},
  isVertical: false,
  collapsed: false,
  toggleOnItemClick: false,
  toggleOpenKey: () => {},
  onItemClick: () => {},
  theme: '',
});

export default MenuContext;

export interface MenuProviderProps extends MenuContextBaseType {
  menu: MenuItemType[];
  onOpenKeysChange: (
    openKeys: OpenKeysType,
    changedKey: string,
    isOpen: boolean,
  ) => void;
  children: React.ReactNode;
}

export const MenuProvider = (props: MenuProviderProps) => {
  const { children, onOpenKeysChange, menu, defaultOpenAll, ...otherProps } =
    props;
  const { checkedKey, openKeys } = otherProps;
  const allCheckedKeys = useMemo(
    () => findSelectedMenuKey(checkedKey, menu, 'key'),
    [menu, checkedKey],
  );

  const toggleOpenKey = useMemorizedFn((key: string) => {
    const newOpenKeys = { ...openKeys };
    const isOpen = !(newOpenKeys[key] ?? defaultOpenAll);
    newOpenKeys[key] = isOpen;
    onOpenKeysChange(newOpenKeys, key, isOpen);
  });
  return (
    <MenuContext.Provider
      value={{
        ...otherProps,
        defaultOpenAll,
        toggleOpenKey,
        groupCheckedKeys: allCheckedKeys,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
