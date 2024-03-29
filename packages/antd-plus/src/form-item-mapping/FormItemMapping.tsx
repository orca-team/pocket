import type { ReactElement } from 'react';
import { Form } from 'antd';
import type { NamePath } from 'antd/lib/form/interface';
import { PassPropsElement, PassPropsInject } from './PassPropsElement';

const eObj = {};

export type FormItemMappingProps = {

  /** 属性名映射 */
  valueMapping?: Record<string, NamePath>;

  /** 事件映射 */
  triggerMapping?: Record<string, NamePath>;

  /** 是否注入到子组件中，如果需要开发者自行更改注入方式，可以设置为 false */
  inject?: boolean;

  /** 子组件 */
  children?: ReactElement;
};

// 从表单中获取多个属性，并将它们注入到子组件中，支持属性名映射
export function FormItemMapping(props: FormItemMappingProps) {
  const { valueMapping = eObj as Record<string, NamePath>, triggerMapping = eObj as Record<string, NamePath>, children, inject = true } = props;

  if (children == null) return null;

  let element = children;

  if (inject) element = <PassPropsInject>{element}</PassPropsInject>;

  let fieldsKeys = Object.entries(valueMapping);

  while (fieldsKeys.length > 0) {
    const [[propName, fieldName], ...otherPropsNames] = fieldsKeys;
    fieldsKeys = otherPropsNames;
    element = (
      <Form.Item name={fieldName} valuePropName={propName} trigger="empty" noStyle>
        <PassPropsElement __passPropsNameList={[propName]}>{element}</PassPropsElement>
      </Form.Item>
    );
  }

  let triggerKeys = Object.entries(triggerMapping);

  while (triggerKeys.length > 0) {
    const [[triggerName, fieldName], ...otherTriggers] = triggerKeys;
    triggerKeys = otherTriggers;
    element = (
      <Form.Item name={fieldName} trigger={triggerName} valuePropName="empty" noStyle>
        <PassPropsElement __passPropsNameList={[triggerName]}>{element}</PassPropsElement>
      </Form.Item>
    );
  }

  return element;
}

export default FormItemMapping;
