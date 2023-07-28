import { useMemoizedFn } from 'ahooks';
import type { ReactElement } from 'react';
import { cloneElement, isValidElement, useContext, useMemo } from 'react';
import FormItemMapping from './FormItemMapping';
import { PassPropsContext } from './PassPropsElement';

export interface FormItemMappingValueProps {

  /** 外部（表单）与内部（组件）字段的映射关系 */
  valueMapping: Record<string, string | string[]>;

  /** 属性名 默认为 `value` */
  valuePropName?: string;

  /** 触发器名 默认为 `onChange` */
  trigger?: string;

  /** 子组件 */
  children?: ReactElement;
}

// 將 props 上的屬性轉換爲 object
const ObjectValueTransfer = (props: FormItemMappingValueProps) => {
  const { valueMapping, children, trigger = 'onChange', valuePropName = 'value' } = props;

  const propsFromParent = useContext(PassPropsContext);

  // 從 propsFromParent 中取得屬性
  const value = useMemo(() => {
    const value: Record<string, any> = {};
    Object.keys(valueMapping).forEach((key) => {
      // eslint-disable-next-line react/destructuring-assignment
      value[key] = propsFromParent[key];
    });
    return value;
  }, [propsFromParent, valueMapping]);

  const handleChange = useMemoizedFn((v: Record<string, any>) => {
    Object.entries(v).forEach(([key, value]) => {
      // eslint-disable-next-line react/destructuring-assignment
      const fn = propsFromParent[`trigger_${key}`];
      if (typeof fn === 'function') {
        fn(value);
      }
    });
  });

  return isValidElement(children) ? (
    cloneElement(children, {
      [valuePropName]: value,
      [trigger]: handleChange,
    })
  ) : (
    <>{null}</>
  );
};

export function FormItemMappingValue(props: FormItemMappingValueProps) {
  const { valueMapping, children, valuePropName, trigger } = props;

  // 根據 valueMapping 自動生成事件
  const triggerMapping = useMemo(() => {
    const triggerMapping: Record<string, string | string[]> = {};
    Object.keys(valueMapping).forEach((key) => {
      triggerMapping[`trigger_${key}`] = valueMapping[key];
    });
    return triggerMapping;
  }, [valueMapping]);

  return (
    <FormItemMapping valueMapping={valueMapping} triggerMapping={triggerMapping} inject={false}>
      <ObjectValueTransfer valueMapping={valueMapping} trigger={trigger} valuePropName={valuePropName}>
        {children}
      </ObjectValueTransfer>
    </FormItemMapping>
  );
}

export default FormItemMappingValue;
