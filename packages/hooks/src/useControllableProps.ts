import { usePersistFn } from 'ahooks';
import { useState } from 'react';
import { omit, omitBy, isUndefined } from 'lodash-es';

type ControllableState<T, U> = { [P in keyof T]: T[P] } &
  { [P in keyof U]-?: Exclude<U[P], undefined> } & { [key: string]: any };

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

  const [state, setState] = useState(initProps);

  const changeProps = usePersistFn((newProps = {}) => {
    const { onPropsChange } = props;
    const validProps = validateProps(initProps, newProps);
    const nextState = getChangedState(props, validProps);
    if (nextState) {
      setState({ ...state, ...nextState });
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
      result.default = onPropsChange({ ...state, ...newProps });
    }
    return result;
  });
  let finalProps = {
    ...state,
    ...omitBy(props, isUndefined),
  } as unknown as ControllableState<T, P>;
  if (omitListener) {
    const omitProps: string[] = ([] as string[])
      .concat(combineListener ? ['onPropsChange'] : [])
      .concat(autoOnChange ? getPropsListenerName(initProps) : []);
    finalProps = omit(finalProps as any, omitProps) as ControllableState<T, P>;
  }

  return [finalProps, changeProps];
}
