import { useState } from 'react';
import { isUndefined, omit, omitBy, pick } from 'lodash-es';
import useMemoizedFn from './useMemorizedFn';

type ControllableState<T, U> = { [P in keyof T]: T[P] } & {
  [P in keyof U]-?: Exclude<U[P], undefined>;
} & Record<string, any>;

export const upperFirstKey = (str = '') => {
  if (str.length > 0) {
    return str[0].toUpperCase() + str.substr(1);
  }
  return '';
};

export const getPropListenerName = (key: string): string =>
  `on${key === 'value' ? '' : upperFirstKey(key)}Change`;

export const getPropsListenerName = (props = {}) =>
  Object.keys(props).map(getPropListenerName);

export const validateProps = (
  initProps: Record<string, any>,
  newProps: Record<string, any> = {},
) => {
  const res: Record<string, any> = {};
  Object.keys(newProps).forEach((key) => {
    if (Object.hasOwnProperty.call(initProps, key)) {
      res[key] = newProps[key];
    }
  });
  return res;
};

/**
 * 对比变化的属性，提取出需要变化的state（属性值为undefined）
 *
 * @param newProps
 * @private
 */
export const getChangedState = <T extends Record<string, any>>(
  props: T,
  newProps: Record<string, any> = {},
) => {
  let res: Record<string, any> | undefined;
  Object.keys(newProps).forEach((key) => {
    if (props[key] === undefined) {
      if (!res) res = {} as T;
      res[key] = newProps[key];
    }
  });
  return res as T;
};

export type ControllablePropsConfig = {
  omitListener?: boolean;
  autoOnChange?: boolean;
  combineListener?: boolean;
};

export default function useControllableProps<
  T extends Record<string, any>,
  P extends Partial<T>,
>(
  props: T,
  initProps: P = {} as P,
  config: ControllablePropsConfig = {},
): [ControllableState<T, P>, (props: Partial<P>) => any] {
  const {
    omitListener = true,
    autoOnChange = true,
    combineListener = true,
  } = config;

  const [initPropsKeys] = useState(() => Object.keys(initProps));

  // inner state
  const [state, setState] = useState(initProps);

  let finalProps = {
    ...state,
    ...omitBy(props, isUndefined), // remove all undefined props
  } as unknown as ControllableState<T, P>;

  // final state
  const mergedState = pick(finalProps, initPropsKeys) as P;

  const changeProps = useMemoizedFn((newProps = {}) => {
    const { onPropsChange } = props;
    // delete attrs which not in `initProps`
    const validProps = validateProps(initProps, newProps);
    const nextState = getChangedState(props, validProps);
    if (nextState) {
      setState({
        ...mergedState,
        ...nextState,
      });
    }

    const result: any = {};

    if (autoOnChange) {
      Object.keys(validProps).forEach((key) => {
        const listenerName = getPropListenerName(key);
        const { [listenerName]: onChangeFunc } = props;
        if (typeof onChangeFunc === 'function') {
          result[key] = onChangeFunc(validProps[key], newProps);
        }
      });
    }
    if (combineListener && typeof onPropsChange === 'function') {
      result.default = onPropsChange({ ...mergedState, ...newProps });
    }
    return result;
  });

  if (omitListener) {
    // get the listener prop name according `initProps`
    const omitProps: string[] = ([] as string[])
      .concat(combineListener ? ['onPropsChange'] : [])
      .concat(autoOnChange ? getPropsListenerName(initProps) : []);

    // remove all listener
    finalProps = omit(finalProps as any, omitProps) as ControllableState<T, P>;
  }

  return [finalProps, changeProps];
}
