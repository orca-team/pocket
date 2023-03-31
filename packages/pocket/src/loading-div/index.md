---
title: LoadingDiv 加载中容器
nav:
  title: Pocket 组件
  path: /component
group:
  title: 基础组件
  path: /base
---

# LoadingDiv 加载中容器

`antd` 的 `Spin` 的样式比较奇怪，不便于在一些场景下集成，所以做了一个自定义的。

## 使用示例

```tsx
/**
 * title: 基础用法
 * description: 作为普通 div 使用，在里面写事件的内容即可
 */
import React from 'react';
import { LoadingDiv } from '@orca-fe/pocket';
import { Spin } from 'antd';

export default () => {
  // LoadingDiv 不依赖 antd，但你可以使用 loadingComponent 替换为 antd 的 Spin
  return (
    <LoadingDiv loading loadingComponent={<Spin spinning />} style={{ border: '1px solid #CCC' }}>
      <div>我是内容</div>
      <div>我是内容我是内容</div>
      <div>我是内容</div>
      <div>我是内容我是内容我是内容</div>
      <div>我是内容</div>
    </LoadingDiv>
  );
};
```

```tsx
/**
 * title: 绝对定位覆盖
 * description: 使用 absolute 属性，作为一个覆盖物，占满整个容器，适用于 LoadingDiv 不能作为容器的情况（但需要有 position）
 */
import React from 'react';
import { LoadingDiv } from '@orca-fe/pocket';
import { Button, Cascader, DatePicker, Form, Input, InputNumber, Radio, Select, Spin, Switch, TreeSelect } from 'antd';

export default () => {
  return (
    <Form style={{ maxWidth: 600, position: 'relative' }}>
      <Form.Item label="Form Size" name="size">
        <Radio.Group>
          <Radio.Button value="small">Small</Radio.Button>
          <Radio.Button value="default">Default</Radio.Button>
          <Radio.Button value="large">Large</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Input">
        <Input />
      </Form.Item>
      <Form.Item label="Select">
        <Select>
          <Select.Option value="demo">Demo</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="TreeSelect">
        <TreeSelect treeData={[{ title: 'Light', value: 'light', children: [{ title: 'Bamboo', value: 'bamboo' }] }]} />
      </Form.Item>
      <Form.Item label="Cascader">
        <Cascader options={[{ value: 'zhejiang', label: 'Zhejiang', children: [{ value: 'hangzhou', label: 'Hangzhou' }] }]} />
      </Form.Item>
      <Form.Item label="DatePicker">
        <DatePicker />
      </Form.Item>
      <Form.Item label="InputNumber">
        <InputNumber />
      </Form.Item>
      <Form.Item label="Switch" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="Button">
        <Button>Button</Button>
      </Form.Item>
      <LoadingDiv absolute loading loadingComponent={<Spin spinning />} />
    </Form>
  );
};
```

## ReactScript Props

| 属性                   | 说明                    | 类型                 | 默认值 |
| ---------------------- | ----------------------- | -------------------- | ------ |
| loadingComponent       | 自定义 loading 组件     | `React.ReactElement` | -      |
| loadingBackgroundColor | 配置 loading 的背景颜色 | `string`             | -      |
| absolute               | 是否绝对定位            | `boolean`            | -      |
| loading                | 是否正在加载            | `boolean`            | -      |
