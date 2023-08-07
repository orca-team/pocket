import React, { useEffect, useMemo } from 'react';
import type { NamePath } from 'antd/lib/form/interface';
import type { FormInstance } from 'antd';
import { Form } from 'antd';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { FormItemMappingValue } from '../form-item-mapping';

const ef = () => undefined;

const eObj = {};

type ValueWatcherProps = {

  /** 注入的值 */
  value?: any;

  /** 监听字段的格式，用于拼接 valueList */
  length: number;

  /** 值变化后触发的事件 */
  onValueChange?: (value: any) => void;

  /** 是否只监听值变化，默认为 true */
  update?: boolean;
};
// 内部监听组件，用于监听 FormItemMappingValue 注入的值
const ValueWatcher = (props: ValueWatcherProps) => {
  const { onValueChange: _onValueChange = ef, value = eObj, length, update = true } = props;
  const onValueChange = useMemoizedFn(_onValueChange);

  const useEffectFn = !update ? useEffect : useUpdateEffect;

  useEffectFn(() => {
    const resultList: any[] = [];
    for (let i = 0; i < length; i++) {
      resultList.push(value[i]);
    }
    onValueChange(resultList);
  }, [value, length]);

  return <>{null}</>;
};

export type FormItemListenerProps = {

  /** 需要监听的字段列表 */
  namePathList: NamePath[];

  /** 是否仅在表单字段发生更新时，触发事件 */
  update?: boolean;

  /** 表单变化事件 */
  onChange?: (value: any[], formInstance: FormInstance<any>) => void;
};

const FormItemListener = (props: FormItemListenerProps) => {
  const { namePathList, update, onChange: _onChange = ef } = props;
  const onChange = useMemoizedFn(_onChange);

  // 根据 namePathList 构建 valueMapping
  const valueMapping = useMemo(
    () =>
      namePathList.reduce<Record<string, NamePath>>(
        (acc, key, index) => ({
          ...acc,
          [index.toString()]: key,
        }),
        {},
      ),
    [namePathList],
  );

  const form = Form.useFormInstance();

  return (
    <FormItemMappingValue valueMapping={valueMapping}>
      <ValueWatcher
        update={update}
        length={namePathList.length}
        onValueChange={(valueList) => {
          onChange(valueList, form);
        }}
      />
    </FormItemMappingValue>
  );
};

export default FormItemListener;
