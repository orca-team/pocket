export default class KeyManager<T extends Object> {
  protected map = new WeakMap<T, string>();

  protected index = 0;

  keyField: string = '';

  constructor(keyField: string = '') {
    this.keyField = keyField;
  }

  getKeys(arr: T[]) {
    const uniqSet = new Set<T>();
    return arr.map((item, index) => {
      if (this.keyField) {
        return item[this.keyField];
      }
      let key = this.map.get(item);
      if (key == null) {
        key = `${this.index++}`;
        this.map.set(item, key);
      }
      if (uniqSet.has(item)) {
        console.warn(`Duplicate item detected in array[${index}]:`, item);
      }
      uniqSet.add(item);
      return key;
    });
  }
}
