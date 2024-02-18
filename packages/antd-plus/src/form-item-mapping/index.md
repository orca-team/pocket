---
title: FormItemMapping 表单多字段映射

group:
  title: 表單增強
  path: /form
  order: 1
---

# FormItemMapping 表单多字段映射

默认情况下，`antd` 的 `Form.Item` 下只能传递单个字段给到表单输入组件。但是，我们在实际业务中，有时候需要处理多个字段，比如：

- 地址输入组件，需要拆分成 `province`、`city`、`district`、`street` 等字段
- 电话输入组件，需要拆分成 `areaCode`、`number` 等字段
- 姓名组件，需要拆分成 `firstName`、`lastName` 等字段

接口数据通常是扁平化的，并不会按照表单字段来拆分。（比如下面这样）

```javascript | pure
const res = {
  province: '广东省',
  city: '深圳市',
  district: '南山区',
  street: '科技园',
  areaCode: '0755',
  number: '12345678',
  firstName: '张',
  lastName: '三',
};
```

如果我们将数据转换的工作放在接口处理，在查询和修改（插入）时，都需要做额外的处理。
特别是当有多个页面多个接口都包含这样的逻辑时，重复的代码就会非常多。

那么，如果我们将数据转换的工作放在末端的表单组件中，让组件自己适配数据结构，这样不管有多少页面，我都只要写一次组件，就能在多个页面复用，是不是就能使代码更加简洁了呢？

`FormItemMapping` 组件就是为了协助你封装这样特殊的表单组件而生的，它可以将多个字段映射到一个表单输入组件上。

## 示例

<code src="./demo/Demo1.tsx"></code>
<code src="./demo/Demo2.tsx"></code>

```tsx
/**
 * debug: true
 */
import { Form, Select } from 'antd';
import { FormItemMappingValue } from '@orca-fe/antd-plus';

export default () => {
  return (
    <Form>
      <div style={{ marginBottom: 8 }}>@orca-fe/antd-plus@0.3.17 版本下，当 clear Select 的值时会导致页面报错</div>
      <FormItemMappingValue valueMapping={{ label: 'label', value: 'value' }}>
        <Select options={[{ label: 'demo', value: 'demo' }]} style={{ width: 300 }} labelInValue allowClear />
      </FormItemMappingValue>
    </Form>
  );
};
```

## API

### FormItemMapping

将多个字段映射到一个组件的多个属性上

| 属性           | 说明                                                                   | 类型                                 | 默认值 | 版本 |
| -------------- | ---------------------------------------------------------------------- | ------------------------------------ | ------ | ---- |
| valueMapping   | 属性名称映射                                                           | `Record<string, string \| string[]>` | -      | -    |
| triggerMapping | 事件映射                                                               | `Record<string, string \| string[]>` | -      | -    |
| inject         | 是否注入到子组件中，如果需要开发者自行更改注入方式，可以设置为 `false` | `boolean`                            | `true` | -    |
| children       | 子组件                                                                 | `ReactElement`                       | -      | -    |

### FormItemMappingValue

在 `FormItemMapping` 的功能上，将所有字段组合成一个 `Object` 对象，作为 `value` 传递给子组件。

| 属性          | 说明         | 类型                                 | 默认值     | 版本 |
| ------------- | ------------ | ------------------------------------ | ---------- | ---- |
| valueMapping  | 属性名称映射 | `Record<string, string \| string[]>` | -          | -    |
| valuePropName | 属性名       | `string`                             | `value`    | -    |
| trigger       | 触发器名     | `string`                             | `onChange` | -    |
| children      | 子组件       | `ReactElement`                       | -          | -    |
