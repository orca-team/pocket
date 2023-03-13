import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

type GetStateAction<S> = () => S;

function useGetState<S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>, GetStateAction<S>] {
  const [_this] = useState(() => ({
    // @ts-expect-error
    state: typeof initialState === 'function' ? initialState() : initialState,
  }));

  const getState = useMemoizedFn(() => _this.state);

  const [state, _setState] = useState<S>(_this.state);

  const setState = useMemoizedFn<Dispatch<SetStateAction<S>>>((state) => {
    if (typeof state === 'function') {
      _setState((originState) => {
        // @ts-expect-error
        const newState = state(originState);
        _this.state = newState;
        return newState;
      });
    } else {
      _this.state = state;
      _setState(state);
    }
  });

  return [state, setState, getState];
}

export default useGetState;
