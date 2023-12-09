export default class KeyManager<T extends Object> {
  protected map = new WeakMap<
    T,
    {
      key: string;
      extraInfo?: any;
    }
  >();

  protected index = 0;

  keyField: string = '';

  constructor(keyField: string = '') {
    this.keyField = keyField;
  }

  replace(oldItem: T, newItem: T) {
    const item = this.map.get(oldItem);
    if (item != null) {
      this.map.set(newItem, item);
      // this.map.delete(oldItem);
    }
  }

  getKey(item: T, extraInfo?: any) {
    const itemValue = this.map.get(item);
    let key = itemValue?.key;
    if (this.keyField && item && item[this.keyField]) {
      key = item[this.keyField];
    }
    if (key == null) {
      key = `${this.index++}`;
    }
    this.map.set(item, {
      key,
      extraInfo: extraInfo || itemValue?.extraInfo,
    });
    return key;
  }

  getKeys(arr: T[], extraInfo?: any) {
    const uniqSet = new Set<T>();
    return arr.map((item, index) => {
      const key = this.getKey(item, typeof extraInfo === 'function' ? extraInfo(item, index) : extraInfo);
      if (uniqSet.has(item)) {
        console.warn(`Duplicate item detected in array[${index}]:`, item);
      }
      uniqSet.add(item);
      return key;
    });
  }

  getExtraInfo(item: T) {
    return this.map.get(item)?.extraInfo;
  }
}
