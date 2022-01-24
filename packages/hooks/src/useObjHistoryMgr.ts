import { useRef, useState } from 'react';
import useMemoizedFn from './useMemorizedFn';

export interface UseObjHistoryMgrType<T extends Object> {
  value: T | undefined;
  setValue: (val: Partial<T>) => void;
  replaceValue: (val: Partial<T>) => void;
  backLength: number;
  forwardLength: number;
  go: (step: number) => void;
  back: () => void;
  forward: () => void;
  reset: (newInitialValue?: T) => void;
}

const modifiedKeys = Symbol('modifiedKeys');

export const getHistoryModifiedKeys = <T extends Object>(obj: T) =>
  new Set(obj[modifiedKeys] || []);

export default function useObjHistoryMgr<T extends Object>(
  defaultValue?: T,
): UseObjHistoryMgrType<T> {
  // defaultValue
  const [_defaultValue] = useState(() => ({
    history: defaultValue ? [defaultValue] : ([] as T[]),
    current: 0,
  }));

  const currentRef = useRef(0);

  const [history, setHistory] = useState(_defaultValue);

  const { current, history: historyArr } = history;
  const currentValue = historyArr[current];
  currentRef.current = current;

  const backLength = current;
  const forwardLength = historyArr.length - current - 1;

  const replaceValue = useMemoizedFn<UseObjHistoryMgrType<T>['replaceValue']>(
    (value) => {
      setHistory(({ history: historyArr, current }) => {
        const currentValue = historyArr[current];
        const newValue = {
          ...currentValue,
          ...value,
          [modifiedKeys]: [
            ...currentValue[modifiedKeys],
            ...Object.keys(value),
          ],
        };
        const newHistory = {
          history: historyArr.slice(0, current).concat([newValue]),
          current,
        };
        currentRef.current = newHistory.current;
        return newHistory;
      });
    },
  );

  const setValue = usePersistFn<UseObjHistoryMgrType<T>['setValue']>(
    (value) => {
      // state 和 ref 中的 current 不匹配，说明执行了多次 setValue，调用 replace 来合并
      if (history.current !== currentRef.current) {
        replaceValue(value);
      } else {
        setHistory((oldState) => {
          const { history: historyArr, current } = oldState;
          const currentValue = historyArr[current];

          const newValue = {
            ...currentValue,
            ...value,
            [modifiedKeys]: [...Object.keys(value)],
          };
          const newHistory = {
            history: historyArr.slice(0, current + 1).concat([newValue]),
            current: current + 1,
          };
          currentRef.current = newHistory.current;
          return newHistory;
        });
      }
    },
  );

  const reset = usePersistFn<UseObjHistoryMgrType<T>['reset']>((value) => {
    setHistory(() => {
      const newValue = _defaultValue;
      if (value) {
        newValue.history = [value];
      }
      return newValue;
    });
  });

  const go = usePersistFn<UseObjHistoryMgrType<T>['go']>((num) => {
    setHistory(({ history: historyArr, current }) => {
      const newIndex = Math.max(
        0,
        Math.min(historyArr.length - 1, current + num),
      );
      return {
        history: historyArr,
        current: newIndex,
      };
    });
  });

  const back = usePersistFn<UseObjHistoryMgrType<T>['back']>(() => {
    go(-1);
  });
  const forward = usePersistFn<UseObjHistoryMgrType<T>['forward']>(() => {
    go(1);
  });

  return {
    value: currentValue,
    setValue,
    replaceValue,
    reset,
    go,
    back,
    forward,
    backLength,
    forwardLength,
  };
}
