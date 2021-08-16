import React from 'react';

export interface RenderOptions {
  checked: boolean;
}

export interface MenuItemType {
  key: string;
  icon?: React.ReactNode;
  path?: string;
  text?: string;
  render?: (options: RenderOptions) => React.ReactNode;
  children?: MenuItemType[];
}

export function findSelectedMenuIndex(
  path: string,
  menu: MenuItemType[],
  key: keyof MenuItemType = 'path',
): number[] {
  for (let i = 0; i < menu.length; i++) {
    const m = menu[i];
    if (m[key] === path) {
      return [i];
    }
    if (m.children) {
      const res = findSelectedMenuIndex(path, m.children, key);
      if (res.length > 0) {
        return [i, ...res];
      }
    }
  }
  return [];
}

export function findSelectedMenuKey(
  path: string,
  menu: MenuItemType[],
  key: keyof MenuItemType = 'path',
): string[] {
  const indexs = findSelectedMenuIndex(path, menu, key);
  const res: string[] = [];
  let _menu: MenuItemType[] | undefined = menu;
  for (let i = 0; i < indexs.length; i++) {
    const menuIndex = indexs[i];
    if (_menu?.[menuIndex]) {
      res.push(_menu[menuIndex].key);
      _menu = _menu[menuIndex].children;
    } else {
      return [];
    }
  }
  return res;
}
