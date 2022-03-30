import React from 'react';

export interface RenderOptions {
  checked: boolean;
}

export interface BaseMenuItemType<T extends BaseMenuItemType<T>> {
  children?: T[];
}

export interface MenuItemType {
  key: string;
  icon?: React.ReactNode;
  path?: string;
  redirect?: string;
  text?: string;
  visible?: boolean;
  render?: (options: RenderOptions) => React.ReactNode;
  children?: MenuItemType[];
  style?: React.CSSProperties;
}

export function findSelectedMenuIndex<T extends BaseMenuItemType<T>>(
  path: string,
  menu: T[],
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

export function findSelectedMenuIndexTraverse<T extends BaseMenuItemType<T>>(
  path: string,
  menu: T[],
  key: keyof MenuItemType = 'path',
): number[] {
  const pathArr = path.split('/');
  let { length } = pathArr;
  let res: number[] = [];
  while (res.length === 0 && length > 1) {
    const p = pathArr.slice(0, length).join('/');
    res = findSelectedMenuIndex(p, menu, key);
    length -= 1;
  }
  return res;
}

export function findSelectedMenuKey<T extends BaseMenuItemType<T>>(
  path: string,
  menu: MenuItemType[],
  key: keyof MenuItemType = 'path',
): string[] {
  const indexs = findSelectedMenuIndexTraverse(path, menu, key);
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

export function findSelectedMenu<T extends BaseMenuItemType<T>>(
  path: string,
  menu: T[],
  key: keyof MenuItemType = 'path',
): T[] {
  const indexs = findSelectedMenuIndexTraverse(path, menu, key);
  const res: T[] = [];
  let _menu: T[] | undefined = menu;
  for (let i = 0; i < indexs.length; i++) {
    const menuIndex = indexs[i];
    if (_menu?.[menuIndex]) {
      res.push(_menu[menuIndex]);
      _menu = _menu[menuIndex].children;
    } else {
      return [];
    }
  }
  return res;
}
