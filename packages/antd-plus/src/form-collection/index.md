---
title: FormCollection 表单集合组件

group:
  title: 表單增強
  path: /form
  order: 1
---

# FormCollection 表单集合组件

> 注意：该组件目前处于试验阶段。

`FormCollection` 能方便地管理多个 `Form` 组件存在的情况。

`FormCollection` 所做的工作是为每个 `Form` 自动创建并接管 `FormInstance`，它不会产生多余的 DOM 节点，也不会修改表单域的数据。

## 何时使用

- 需要动态创建多个受控 `Form` 表单域
- 页面中需要统一控制多个不同的复杂 `Form` 组件

## 示例

<code title="动态渲染多个表单" src="./demo/basis.tsx"></code>

## API

### FormCollection

| 属性           | 说明                                                                         | 类型                                              | 默认值 | 版本 |
| -------------- | ---------------------------------------------------------------------------- | ------------------------------------------------- | ------ | ---- |
| formCollection | [useFormCollection()](#useformcollection) 创建的控制实例，不提供时会自动创建 | [FormCollectionInstance](#formcollectioninstance) | -      | -    |

## FormCollection.Control

`FormCollection.Control` 能够自动创建 `FormInstance` 接管 `Form`，它不产生多余的 DOM ，**本身只能用于包裹 `Form` 组件**。

| 属性 | 说明                     | 类型     | 默认值 | 版本 |
| ---- | ------------------------ | -------- | ------ | ---- |
| name | 当前受控的表单名称，必填 | `string` | -      | -    |

## FormCollectionInstance

| 属性          | 说明             | 类型                                                        | 默认值 | 版本 |
| ------------- | ---------------- | ----------------------------------------------------------- | ------ | ---- |
| getForm       | 获取表单实例     | `(formName: string) => FormInstance`                        | -      | -    |
| getForms      | 获取一组表单实例 | `(formNameList?: string[]) => Record<string, FormInstance>` | -      | -    |
| validateForm  | 校验表单         | `(formName: string) => Promise<any> \| null`                | -      | -    |
| validateForms | 校验一组表单     | `(formNameList?: string[]) => Promise<ValidateFormResult>`  | -      | -    |

### ValidateFormResult

| 属性         | 说明             | 类型                    | 默认值 | 版本 |
| ------------ | ---------------- | ----------------------- | ------ | ---- |
| successForms | 校验通过的表单   | `ValidateSuccessForm[]` | `[]`   | -    |
| errorForms   | 校验不通过的表单 | `ValidateErrorForm[]`   | `[]`   | -    |

### ValidateSuccessForm

| 属性       | 说明                   | 类型     | 默认值 | 版本 |
| ---------- | ---------------------- | -------- | ------ | ---- |
| formName   | 表单名称               | `string` | -      | -    |
| formValues | 校验通过后返回的表单值 | `any`    | -      | -    |

### ValidateErrorForm

| 属性      | 说明                 | 类型     | 默认值 | 版本 |
| --------- | -------------------- | -------- | ------ | ---- |
| formName  | 表单名称             | `string` | -      | -    |
| errorInfo | 校验不通过的失败信息 | `any`    | -      | -    |

## Hooks

### useFormCollection

创建 `FormCollection` 实例，用于管理 `FormCollection` 的数据状态。

### useFormCollectionInstance

获取当前上下文正在使用的 `FormCollection` 实例，可在子组件中进行消费。
