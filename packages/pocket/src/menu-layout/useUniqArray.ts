import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

type UseUniqArrayResult<T> = [
  T[],
  {
    add: (item: T) => void;
    remove: (item: T) => void;
    set: (item: T[]) => void;
  },
];

export default function useUniqArray<T>(defaultArr: T[] = []): UseUniqArrayResult<T> {
  const [arr, setArr] = useState<T[]>(defaultArr);

  const add = useMemoizedFn((item: T) => {
    const has = arr.findIndex(i => i === item) >= 0;
    if (!has) {
      setArr([...arr, item]);
    }
  });

  const remove = useMemoizedFn((item: T) => {
    const index = arr.findIndex(i => i === item);
    if (index >= 0) {
      const newArr = [...arr];
      newArr.splice(index, 1);
      setArr(newArr);
    }
  });

  return [arr, { add, remove, set: setArr }];
}
