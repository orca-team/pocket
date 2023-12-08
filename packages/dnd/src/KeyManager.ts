export default class KeyManager<T extends Object> {
  protected map = new WeakMap<T, string>();

  protected index = 0;

  keyField: string = '';

  constructor(keyField: string = '') {
    this.keyField = keyField;
  }

  replace(oldItem: T, newItem: T) {
    const key = this.getKey(oldItem);
    if (key != null) {
      this.map.set(newItem, key);
      // this.map.delete(oldItem);
    }
  }

  getKey(item: T) {
    let key = this.map.get(item);
    if (this.keyField && item && item[this.keyField]) {
      key = item[this.keyField];
    }
    if (key == null) {
      key = `${this.index++}`;
      this.map.set(item, key);
    }
    return key;
  }

  getKeys(arr: T[]) {
    const uniqSet = new Set<T>();
    return arr.map((item, index) => {
      const key = this.getKey(item);
      if (uniqSet.has(item)) {
        console.warn(`Duplicate item detected in array[${index}]:`, item);
      }
      uniqSet.add(item);
      return key;
    });
  }
}
