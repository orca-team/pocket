/**
 * title: 基本用法
 * description: 创建一个使用 `'Y'` 和 `'N'` 作为值的 Switch 组件
 */
import React, { useState } from 'react';
import { Form, Switch } from 'antd';
import { createValueMappedComponent } from '@orca-fe/antd-plus';

// 通过 createValueMappedComponent 创建一个 Switch 组件，使用 'Y' 和 'N' 代替 true 和 false 作为值
const SwitchYN = createValueMappedComponent(Switch, {
  valuePropName: 'checked',
  mapping: [
    ['Y', true],
    ['N', false],
  ],
});

const Demo1 = () => {
  const [formValue, setFormValue] = useState({});

  return (
    <div>
      <Form
        onValuesChange={(_, values) => {
          setFormValue(values);
        }}
      >
        <Form.Item name="check" valuePropName="checked">
          <SwitchYN />
        </Form.Item>
      </Form>
      <pre>{JSON.stringify(formValue, null, 2)}</pre>
    </div>
  );
};

export default Demo1;
