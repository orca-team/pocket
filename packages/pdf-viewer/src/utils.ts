export function findSortedArr(
  arr: number[],
  value: number,
  start = 0,
  end = arr.length,
) {
  const index = Math.floor((start + end) / 2);
  if (arr[end - 1] < value) return end;
  if (index === start) {
    return index;
  }
  if (arr[index] === value) {
    return index;
  }
  if (arr[index] < value) {
    const res = findSortedArr(arr, value, index + 1, end);
    if (res >= 0) return res;
  }
  if (index === 0) return 0;
  if (arr[index - 1] < value) return index;
  return findSortedArr(arr, value, start, index);
}
