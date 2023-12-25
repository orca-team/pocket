import { useMemoizedFn } from 'ahooks';
import type { ComponentType, PropsWithChildren, ReactElement } from 'react';
import { cloneElement, isValidElement, useMemo } from 'react';

const eArr = [];
type BasicType = string | number | boolean | null | undefined;

export interface ValueMappingProps extends Record<string, any> {
  __valuePropName?: string;
  __trigger?: string;
  __mapping?: [BasicType, BasicType][];
  __mappingValue?: (value: any, props?: any) => any;
  __mappingTrigger?: (value: any, props?: any) => any;
  children?: ReactElement;
}

export const ValueMapping = (props: ValueMappingProps) => {
  const { __valuePropName = 'value', __trigger = 'onChange', __mapping = eArr, __mappingValue, __mappingTrigger, children, ...otherProps } = props;

  const { valueMap, triggerMap } = useMemo(() => {
    const __valueMap = new Map<BasicType, BasicType>();
    const __triggerMap = new Map<BasicType, BasicType>();

    __mapping.forEach(([outerValue, innerValue]) => {
      __valueMap.set(outerValue, innerValue);
      __triggerMap.set(innerValue, outerValue);
    });

    return { valueMap: __valueMap, triggerMap: __triggerMap };
  }, [__mapping]);

  const value = otherProps[__valuePropName];

  const finalValue = typeof __mappingValue === 'function' ? __mappingValue(value, otherProps) : valueMap.get(value);

  const handleChange = useMemoizedFn((input: any, ...args: any[]) => {
    const finalTriggerValue = typeof __mappingTrigger === 'function' ? __mappingTrigger(input, otherProps) : triggerMap.get(input);
    const trigger = otherProps[__trigger];
    if (typeof trigger === 'function') {
      return trigger(finalTriggerValue, ...args);
    }
    return undefined;
  });
  return isValidElement(children) ? (
    cloneElement(children, {
      ...otherProps,
      [__valuePropName]: finalValue,
      [__trigger]: handleChange,
    })
  ) : (
    <>{children}</>
  );
};

export default ValueMapping;

export type createValueMappedOptions = {

  /** 值字段名 默认为 `value` */
  valuePropName?: string;

  /** 值变化事件名 默认为 `onChange` */
  trigger?: string;

  /** 一对一值映射 */
  mapping?: [BasicType, BasicType][];

  /** 值映射函数 */
  mappingValue?: (value: any, props?: any) => any;

  /** 事件映射函数 */
  mappingTrigger?: (value: any, props?: any) => any;
};

export function createValueMappedComponent<Props>(Comp: ComponentType<Props>, options: createValueMappedOptions) {
  const { mappingTrigger, mappingValue, mapping, trigger, valuePropName } = options;
  return function MappedComponent(props: Props) {
    const { children } = props as PropsWithChildren;
    return (
      <ValueMapping
        {...props}
        __mappingTrigger={mappingTrigger}
        __mappingValue={mappingValue}
        __mapping={mapping}
        __trigger={trigger}
        __valuePropName={valuePropName}
      >
        {/* @ts-expect-error */}
        <Comp>{children}</Comp>
      </ValueMapping>
    );
  };
}
