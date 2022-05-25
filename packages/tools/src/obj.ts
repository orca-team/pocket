/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
type ObjMapCallback = (key: string, value: any) => any;

export function objMap<T extends Object>(
  obj: T,
  callback: ObjMapCallback = (k, v) => v,
) {
  const result: any = {};
  let changed = false;
  Object.entries(obj).forEach(([key, value]) => {
    const r = callback(key, value);
    if (r !== value) {
      changed = true;
      result[key] = r;
    } else {
      result[key] = value;
    }
  });
  return changed ? result : obj;
}

/**
 * 对象内容过滤器
 * @param obj 对象本身
 * @param callback 过滤器回调
 */
export function objFilter<T extends Object>(
  obj: T,
  callback: (key: string, value: any) => boolean,
) {
  const result: any = {};
  Object.entries(obj).forEach(([key, value]) => {
    const r = callback(key, value);
    if (r) {
      result[key] = value;
    }
  });
  return result;
}
