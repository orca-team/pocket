/**
 * 将 value 注册到 window 上，如果 window 中不存在该内容，则将 value 挂载上去，否则直接使用该内容
 */
export function registerGlobal<T>(key: string | symbol, value: T): T {
  if (!key || value === undefined) throw new Error('registerGlobal: key or value is empty.');
  if (window[key] === undefined) {
    // 新增
    window[key] = value;
    return value;
  }
  // 已存在内容
  const originValue = window[key];
  if (typeof originValue === typeof value) {
    return originValue;
  }
  throw new Error(`Global key ${key.toString()} conflict! Please check your value type`);
}

/**
 * 取消注册内容
 * @param key
 * @param value
 */
export function unregisterGlobal(key: string | symbol, value: any) {
  if (!key || value === undefined) return false;
  if (window[key] === value) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete window[key];
    return true;
  }
  return false;
}
