import type { ReactElement } from 'react';
import { Form } from 'antd';
import type { NamePath } from 'antd/lib/form/interface';
import { PassPropsElement, PassPropsInject } from './PassPropsElement';

const eObj = {};

export type FormItemMappingProps = {

  /** 屬性名稱映射 */
  valueMapping?: Record<string, NamePath>;

  /** 事件映射 */
  triggerMapping?: Record<string, NamePath>;

  /** 是否注入到子組件中，如果需要開發者自行更改注入方式，可以設置爲 false */
  inject?: boolean;

  /** 子组件 */
  children?: ReactElement;
};

// 從表單中取得多個屬性，並將它們注入到子組件中，支持屬性名稱映射
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
