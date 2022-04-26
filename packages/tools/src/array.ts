export const changeArr = <T>(arr: T[], index: number, newItem: T) => {
  const newArr = arr.map((item, i) => (index === i ? newItem : item));
  if (newArr.length <= index) {
    newArr[index] = newItem;
  }
  return newArr;
};

export const removeArrIndex = <T>(arr: T[], ...index: number[]) => {
  const cache = new Set(index);
  const newArr: T[] = [];
  arr.forEach((item, i) => {
    if (!cache.has(i)) {
      newArr.push(item);
    }
  });
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
