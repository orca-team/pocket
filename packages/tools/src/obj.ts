/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
type ObjMapCallback = (key: string, value: any) => any;

export function objMap<T extends Object>(obj: T, callback: ObjMapCallback = (k, v) => v) {
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
export function objFilter<T extends Object>(obj: T, callback: (key: string, value: any) => boolean) {
  const result: any = {};
  Object.entries(obj).forEach(([key, value]) => {
    const r = callback(key, value);
    if (r) {
      result[key] = value;
    }
  });
  return result;
}

export function objOmitUndefined<T extends Object>(obj: T, omitNull = true) {
  return objFilter(obj, (key, value) => {
    if (omitNull && value === null) return false;
    return value !== undefined;
  });
}

export function omit<T extends Object, K extends keyof T>(obj: T, ...args: K[]): Omit<T, K> {
  const result = { ...obj };
  args.forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete result[key];
  });
  return result;
}

/**
 * 将对象中的 null 转换为 undefined
 * @param value
 */
export function convertNullToUndefined<T>(value: T): T {
  const cache = new WeakMap<any, T>();
  function convert(value: T): T {
    if (value === null) return undefined as any;
    // array
    if (Array.isArray(value)) {
      if (!cache.has(value)) {
        const newArray: any[] = [];
        cache.set(value, newArray as any);
        value.forEach((v) => {
          newArray.push(convert(v));
        });
      }
      return cache.get(value)!;
    }
    if (typeof value === 'object' && value.constructor.name === 'Object') {
      if (!cache.has(value)) {
        const newObj = {};
        cache.set(value, newObj as T);
        Object.assign(
          newObj,
          objMap(value, (_, v) => convertNullToUndefined(v)),
        );
      }
      return cache.get(value)!;
    }
    return value;
  }

  return convert(value);
}
