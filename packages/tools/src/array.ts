export const changeArr = <T>(arr: T[], index: number, newItem: T) => {
  const newArr = arr.map((item, i) => (index === i ? newItem : item));
  if (newArr.length <= index) {
    newArr[index] = newItem;
  }
  return newArr;
};

export const removeArrIndex = <T>(arr: T[], index: number) =>
  arr.filter((_, i) => i !== index);

// eslint-disable-next-line eqeqeq
export const toggleArr = <T>(
  arr: T[],
  item: T,
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
