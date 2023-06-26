/* eslint-disable @typescript-eslint/ban-types */
import type { RevMapOptions } from './def';

/**
 * 遍历树状结构
 * @param data 树状数据
 * @param callback 返回值处理
 * @param options 配置
 */
export function revMap<T extends Object, R extends Object>(
  data: T[],
  callback: (d: T, parent: T | undefined, index: number) => R | undefined,
  options: RevMapOptions<T> = {},
): R[] {
  const { childFirst, childKey = 'children', parent, replaceChildren } = options;
  return data.map((datum, index) => {
    if (!datum) return datum; // error object
    const children = datum[childKey] as T[] | undefined;
    let newDatum: R | undefined;
    if (childFirst) {
      let newChildren: R[] = [];
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
export function revFlatMap<O extends Object, T extends Object>(
  data: T[],
  callback: (d: T, parent: T | undefined, index: number, arr: T[]) => O | undefined,
  options: RevMapOptions<T> = {},
): O[] {
  const { childFirst, childKey = 'children', parent } = options;
  const res: O[] = [];
  data.forEach((datum, index, arr) => {
    // error object
    if (!datum) {
      return;
    }
    let children = datum[childKey] as O[] | undefined;
    let newDatum: O | undefined;
    if (childFirst) {
      if (Array.isArray(datum[childKey])) {
        children = revFlatMap(datum[childKey] as T[], callback, {
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
        arr,
      );
      if (children) {
        res.push(...children);
      }
      res.push(newDatum!);
    } else {
      newDatum = callback({ ...datum }, parent, index, arr);
      if (newDatum && Array.isArray(children)) {
        children = revFlatMap(datum[childKey], callback, {
          ...options,
          parent: datum,
        });
        newDatum['children'] = children;
      }
      res.push(newDatum!);
      if (children) {
        res.push(...children);
      }
    }
  });
  return res;
}

/**
 * 将数组转换为树状结构
 */
export function list2tree<ListItem extends Object>(list: ListItem[], idField = 'id', parentIdField = 'parentId', childKey = 'children'): ListItem[] {
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

export function getByPath<T>(data: T[], path: number[], getByIndex?: (item: T) => T[] | undefined): T | undefined {
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

export function treeFind<T>(data: T[], callback: (item: T, path: number[]) => boolean, getChildren?: (item: T) => T[] | undefined): T | undefined {
  function rev(data: T[], path: number[] = []) {
    for (let i = 0; i < data.length; i++) {
      const currentPath = [...path, i];
      const datum = data[i];
      const res = callback(datum, currentPath);
      if (res) {
        return datum;
      }
      const children = typeof getChildren === 'function' ? getChildren(datum) : datum;
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

export type AbstractTreeNodeType<ChildKeyType extends string, TreeNoteType extends Record<string, unknown>> = TreeNoteType & {
  [key in ChildKeyType]?: AbstractTreeNodeType<ChildKeyType, TreeNoteType>[];
};

export type TreeForOptions<ChildKeyType extends string> = {
  childrenKey?: ChildKeyType;
  parentPath?: number[];
  parent?: Record<string, unknown>;
  childFirst?: boolean;
};

/**
 * 递归遍历树
 * @param arr
 * @param callback
 * @param options
 */
export function treeFor<
  ChildKeyType extends string = 'children',
  T extends AbstractTreeNodeType<ChildKeyType, Record<string, unknown>> = AbstractTreeNodeType<ChildKeyType, Record<string, unknown>>,
>(arr: T[], callback: (item: T | null, parent: T | undefined, path: number[]) => void, options: TreeForOptions<ChildKeyType> = {}) {
  const { childrenKey = 'children', parentPath = [], parent, childFirst } = options;
  arr.forEach((item, index) => {
    const path = [...parentPath, index];

    function triggerCallback() {
      callback(item, parent as T, path);
    }

    function revChildren() {
      if (item) {
        const children = item[childrenKey];
        if (Array.isArray(children)) {
          treeFor(children as T[], callback, {
            ...options,
            parentPath: path,
            parent: item,
          });
        }
      }
    }

    if (childFirst) {
      revChildren();
      triggerCallback();
    } else {
      triggerCallback();
      revChildren();
    }
  });
}

export type TreeMapOptions<ChildKeyType extends string> = TreeForOptions<ChildKeyType>;

/**
 * 递归遍历树，并依次替换节点获得全新的树
 * @param arr
 * @param callback
 * @param options
 */
export function treeMap<
  OutTreeNoteType extends Record<string, unknown>,
  ChildKeyType extends string = 'children',
  T extends AbstractTreeNodeType<ChildKeyType, Record<string, unknown>> = AbstractTreeNodeType<ChildKeyType, Record<string, unknown>>,
>(
  arr: T[],
  callback: (item: T | null, parent: AbstractTreeNodeType<ChildKeyType, OutTreeNoteType> | undefined, path: number[]) => OutTreeNoteType | null,
  options: TreeMapOptions<ChildKeyType> = {},
) {
  const { childrenKey = 'children', parentPath = [], parent, childFirst } = options;
  return arr.map<AbstractTreeNodeType<ChildKeyType, OutTreeNoteType> | null>((item, index) => {
    const path = [...parentPath, index];
    let newItem: OutTreeNoteType | null = null;

    function triggerCallback() {
      newItem = callback(item, parent as AbstractTreeNodeType<ChildKeyType, OutTreeNoteType> | undefined, path);
    }

    let newChildren: (AbstractTreeNodeType<ChildKeyType, OutTreeNoteType> | null)[] = [];

    function revChildren() {
      const children = item[childrenKey] as T[];
      if (Array.isArray(children)) {
        newChildren = treeMap(children, callback, {
          ...options,
          parentPath: path,
          parent: item,
        });
      }
    }

    if (childFirst) {
      revChildren();
      triggerCallback();
    } else {
      triggerCallback();
      revChildren();
    }

    if (newItem) {
      // @ts-expect-error
      newItem[childrenKey] = newChildren;
    }
    return newItem as AbstractTreeNodeType<ChildKeyType, OutTreeNoteType> | null;
  });
}

export type TreeFilterOptions = {
  childrenKey?: string;
};

const removeFlag: any = {};

/**
 * 树过滤器，对树状结构的所有节点进行遍历（子节点优先）。
 * 对于需要保留的节点，请返回 true。
 * 当保留子节点时，父节点则不会被遍历，必须存在。
 * @version 0.10.0
 * @param arr
 * @param callback
 * @param options
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function treeFilter<T extends Object>(arr: T[], callback: (item: T, path: T[]) => boolean | void, options: TreeFilterOptions = {}): T[] {
  const { childrenKey = 'children' } = options;

  function rev(list: T[], path: T[] = []) {
    return list
      .map((item) => {
        // 对象类型，取出子节点判断
        if (item && typeof item === 'object') {
          // 先取出 children
          const children = item[childrenKey] as T[];
          if (Array.isArray(children)) {
            // 存在 children，则先遍历 叶子
            const newChildren = rev(children, [...path, item]);
            // 如果子节点存在内容，则本节点必须存在
            if (newChildren.length > 0) {
              return {
                ...item,
                [childrenKey]: newChildren,
              };
            }
          }
        }
        // 判断当前节点是否需要保留
        const res = callback(item, [...path, item]);
        if (res) {
          // 保留
          return item;
        }
        // 其余内容不保留，后续过滤掉所有 removeFlag
        return removeFlag;
      })
      .filter(item => item !== removeFlag);
  }

  return rev(arr);
}
