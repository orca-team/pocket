---
title: FormItemListener 表单字段监听

group:
  title: 表單增強
  path: /form
  order: 1
---

# FormItemListener 表单字段监听

`0.3.0`

基于 FormItemMapping 实现的表单字段监听组件。
你可以使用该组件同时对表单中的多个字段进行监听，并在 `onChange` 事件中处理特殊的业务逻辑。

## 示例

```tsx
import React from 'react';
import { Form, Input, Button } from 'antd';
import { FormItemListener } from '@orca-fe/antd-plus';

const Demo = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form}>
      <Form.Item name="name" label="姓名">
        <Input />
      </Form.Item>
      <Form.Item name="age" label="年龄">
        <Input />
      </Form.Item>
      <FormItemListener
        namePathList={['name', 'age']}
        onChange={(value, formInstance) => {
          console.log(value);
        }}
      />
      <Button
        onClick={() => {
          form.setFieldsValue({
            name: '张三',
            age: '18',
          });
        }}
      >
        设置值
      </Button>
      <div>请打开控制台查看监听内容</div>
    </Form>
  );
};

export default Demo;
```

## API

| 属性         | 说明                                 | 类型                                                    | 默认值 | 版本 |
| ------------ | ------------------------------------ | ------------------------------------------------------- | ------ | ---- |
| namePathList | 需要监听的字段列表                   | NamePath[]                                              | -      | -    |
| update       | 是否仅在表单字段发生更新时，触发事件 | boolean                                                 | false  | -    |
| onChange     | 表单变化事件                         | (value: any[], formInstance: FormInstance<any>) => void | -      | -    |
