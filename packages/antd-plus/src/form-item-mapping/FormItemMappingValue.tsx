import { useMemoizedFn } from 'ahooks';
import type { ReactElement } from 'react';
import { cloneElement, isValidElement, useContext, useMemo } from 'react';
import type { NamePath } from 'antd/lib/form/interface';
import FormItemMapping from './FormItemMapping';
import { PassPropsContext } from './PassPropsElement';

// 前缀，尽量避免属性冲突
const triggerPrefix = 'form_item_mapping_trigger_prefix';

export interface FormItemMappingValueProps {

  /** 外部（表单）与内部（组件）字段的映射关系 */
  valueMapping: Record<string, NamePath>;

  /** 属性名 默认为 `value` */
  valuePropName?: string;

  /** 触发器名 默认为 `onChange` */
  trigger?: string;

  /** 子组件 */
  children?: ReactElement;
}

// 将 props 上的属性转换为对象
const ObjectValueTransfer = (props: FormItemMappingValueProps) => {
  const { valueMapping, children, trigger = 'onChange', valuePropName = 'value' } = props;

  const propsFromParent = useContext(PassPropsContext);

  // 从 propsFromParent 中获取属性
  const value = useMemo(() => {
    const value: Record<string, any> = {};
    Object.keys(valueMapping).forEach((key) => {
      // eslint-disable-next-line react/destructuring-assignment
      value[key] = propsFromParent[key];
    });
    return value;
  }, [propsFromParent, valueMapping]);

  const handleChange = useMemoizedFn((v: Record<string, any>) => {
    const getValue = (key: string) => {
      if (!!v && typeof v === 'object') {
        return v[key];
      }
      return undefined;
    };

    Object.keys(valueMapping).forEach((key) => {
      const oldValue = value[key];
      const newValue = getValue(key);
      const fn = propsFromParent[`${triggerPrefix}_${key}`];
      if (oldValue !== newValue && typeof fn === 'function') {
        fn(newValue);
      }
    });

    if (isValidElement(children)) {
      const originOnChange = children.props?.[trigger];
      if (typeof originOnChange === 'function') originOnChange(v);
    }
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

  // 根据 valueMapping 自动生成事件
  const triggerMapping = useMemo(() => {
    const triggerMapping: Record<string, NamePath> = {};
    Object.keys(valueMapping).forEach((key) => {
      triggerMapping[`${triggerPrefix}_${key}`] = valueMapping[key];
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
