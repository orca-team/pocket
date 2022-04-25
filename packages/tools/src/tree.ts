/* eslint-disable @typescript-eslint/ban-types */
import { Nullable, RevMapOptions } from './def';

/**
 * 遍历树状结构
 * @param data 树状数据
 * @param callback 返回值处理
 * @param options 配置
 */
export function revMap<T extends Object, R extends Object>(
  data: Nullable<T>[],
  callback: (
    d: T,
    parent: T | undefined,
    index: number,
  ) => Nullable<R> | undefined,
  options: RevMapOptions<T> = {},
): Nullable<R>[] {
  const {
    childrenFirst,
    childKey = 'children',
    parent,
    replaceChildren,
  } = options;
  return data.map((datum, index) => {
    if (!datum) return datum; // error object
    const children = datum[childKey] as Nullable<T>[] | undefined;
    let newDatum: Nullable<R> | undefined;
    if (childrenFirst) {
      let newChildren: Nullable<R>[] = [];
      if (Array.isArray(children)) {
        newChildren = revMap(children, callback, { ...options, parent: datum });
      }
      newDatum = callback(
        {
          ...datum,
          [childKey]: newChildren,
        },
        parent,
        index,
      );
    } else {
      newDatum = callback({ ...datum }, parent, index);
      const c = replaceChildren ? newDatum?.[childKey] : children;
      if (newDatum && Array.isArray(c)) {
        newDatum[childKey] = revMap(c, callback, {
          ...options,
          parent: newDatum as unknown as T,
        });
      }
    }

    return (newDatum ?? datum) as R;
  });
}

/**
 * 遍历树状结构，并扁平化
 * @param data 树状数据
 * @param callback 返回值处理
 * @param options 配置
 */
export function revFlatMap<T extends Object>(
  data: T[],
  callback: (d: T, parent: T | undefined, index: number) => T | undefined,
  options: RevMapOptions<T> = {},
): T[] {
  const { childrenFirst, childKey = 'children', parent } = options;
  const res: T[] = [];
  data.forEach((datum, index) => {
    // error object
    if (!datum) {
      return;
    }
    let children = datum[childKey] as T[] | undefined;
    let newDatum: T | undefined;
    if (childrenFirst) {
      if (Array.isArray(children)) {
        children = revFlatMap(children, callback, {
          ...options,
          parent: datum,
        });
      }
      newDatum = callback(
        {
          ...datum,
          [childKey]: children,
        },
        parent,
        index,
      );
    } else {
      newDatum = callback({ ...datum }, parent, index);
      if (newDatum && Array.isArray(children)) {
        children = revFlatMap(children, callback, {
          ...options,
          parent: newDatum,
        });
        newDatum['children'] = children;
      }
    }
    res.push(newDatum || datum);
    if (children) {
      res.push(...children);
    }
  });
  return res;
}

/**
 * 将数组转换为树状结构
 */
export function list2tree<ListItem extends Object>(
  list: ListItem[],
  idField = 'id',
  parentIdField = 'parentId',
  childKey = 'children',
): ListItem[] {
  const root: ListItem[] = [];

  const cache: Record<string, ListItem> = {};
  // create cache
  list.forEach((item) => {
    const id = item[idField];
    cache[id] = item;
  });

  // build tree
  list.forEach((item) => {
    const parentId = item[parentIdField];
    const parent = cache[parentId];
    if (!parent) {
      // root
      root.push(item);
    } else {
      if (!parent[childKey]) {
        parent[childKey] = [];
      }
      parent[childKey].push(item);
    }
  });

  return root;
}

export function getByPath<T>(
  data: T[],
  path: number[],
  getByIndex?: (item: T) => T[] | undefined,
): T | undefined {
  let root = data;
  const p = path.slice();
  while (p.length > 0) {
    const index = p.shift();
    if (index != null) {
      const item = root[index];
      if (p.length === 0) {
        return item;
      }
      if (typeof getByIndex === 'function') {
        const res = getByIndex(item);
        if (!res) return undefined;
        root = res;
      } else if (Array.isArray(item)) {
        root = item as T[];
      }
    }
  }
  return undefined;
}

export function findRev<T>(
  data: T[],
  callback: (item: T, path: number[]) => boolean,
  getChildren?: (item: T) => T[] | undefined,
): T | undefined {
  function rev(data: T[], path: number[] = []) {
    for (let i = 0; i < data.length; i++) {
      const currentPath = [...path, i];
      const datum = data[i];
      const res = callback(datum, currentPath);
      if (res) {
        return datum;
      }
      const children =
        typeof getChildren === 'function' ? getChildren(datum) : datum;
      if (Array.isArray(children)) {
        const childrenRes = rev(children, currentPath);
        if (childrenRes) {
          return childrenRes;
        }
      }
    }
    return undefined;
  }

  return rev(data);
}
