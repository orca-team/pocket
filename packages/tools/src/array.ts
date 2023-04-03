/* eslint-disable no-param-reassign */
import produce from 'immer';

export const insertArr = <T>(arr: T[], index: number, newItem: T) => {
  const newArr = arr.slice();
  newArr.splice(index, 0, newItem);
  return newArr;
};

export const changeArr = <T>(arr: T[], index: number, newItem: T) =>
  produce(arr, (_arr) => {
    // @ts-expect-error
    _arr[index] = newItem;
  });

export const removeArrIndex = <T>(arr: T[], ...index: number[]) => {
  const cache = new Set(index);
  const newArr: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!cache.has(i)) {
      newArr.push(item);
    }
  }
  return newArr;
};

export const toggleArr = <T>(
  arr: T[],
  item: T,
  // eslint-disable-next-line eqeqeq
  compare = (a: T, b: T) => a == b,
) => {
  let includes = false;
  const filterData = arr.filter((t) => {
    const r = compare(t, item);
    if (r) {
      includes = r;
    }
    return !r;
  });

  if (!includes) {
    return [...arr, item];
  }
  return filterData;
};

type Arr2KeysCallback<T> = (item: T, index: number, array: T[]) => string | number;

/**
 * 遍历数组，并获取 键值缓存
 * @param arr 数组
 * @param callback 回调函数，用于获取指定键值，默认取 item.key
 */
export function arr2Keys<T>(arr: T[], callback: Arr2KeysCallback<T> = item => item['key']): Set<string | number> {
  const set = new Set<string | number>();
  arr.forEach((item, index, array) => {
    const key = callback(item, index, array);
    if (key !== null) {
      set.add(key);
    }
  });
  return set;
}

/**
 * 遍历数组，并获取 key-value 缓存
 * @param arr 数组
 * @param callback 回调函数，用于获取指定键值，默认取 item.key
 */
export function arr2KeyValues<T>(arr: T[], callback: Arr2KeysCallback<T> = item => item['key']): Map<string | number, T> {
  const set = new Map<string | number, T>();
  arr.forEach((item, index, array) => {
    const key = callback(item, index, array);
    if (key !== null) {
      set.set(key, item);
    }
  });
  return set;
}
