---
title: EditableTable 可编辑表格

group:
  title: 表單增強
  path: /form
  order: 1
---

`EditableTable` 是一个基于 `Table` 组件封装的简易可编辑表格，它只用于与 `Form` 集成的场景。

## 何时使用

相比于 pro-components 的 [EditableProTable](https://procomponents.ant.design/components/editable-table)，`EditableTable` 在 `Table` 的基础上结合 `Form.Item` 进行了更加简单轻量的封装。  
如果你有以下的需求场景，可以尝试使用 `EditableTable`：

- 需要一键切换表格的 **只读** 和 **可编辑** 状态
- 需要与 `Form.List` 进行嵌套使用

## 代码演示

<code title="基础用法" src="./demo/basic.tsx"></code>

<code title="显示分页" 
src="./demo/pagination.tsx"
description="`pagination` 在 `EditableTable` 中的默认值设置为 `false` ，可以显式地定义 pagination 配置开启分页显示，配置项与 [antd](https://ant-design.antgroup.com/components/pagination-cn) 一致。
"></code>

<code title="受控使用" src="./demo/controlled.tsx" description="通过 `editableRowKeys` 更灵活地控制表格行的可编辑状态。"></code>

<code title="嵌套 Form.List" src="./demo/withFormList.tsx" description="在嵌套 `Form.List` 的场景下结合 `tableNamePath` 属性进行增减等操作，把嵌套 `Form.List` 场景下的 **name** 计算问题交给开发者控制。"></code>

## API

### EditableTable

`EditableTable` 在 `Table` 的 [API基础](https://ant-design.antgroup.com/components/table-cn#api) 上进行了改造和扩展，主要改造点：

- 增加 **name** 和 **tableNamePath** 属性，其中 tableNamePath 用于在多层嵌套 `For-List` 中需要在 render 时操作 form 的场景
- 增加 **readonly** 属性一键切换表格的只读和可编辑模式
- 增加 **editableRowKeys** 用于外部控制表格行的可编辑状态
- 由 onTableChange 代替 Table 的 onChange 事件进行使用
- 对 columns 也进行了 [一些扩展](#editablecolumnstype)

| 属性            | 说明                                                                                     | 类型                                          | 默认值      | 版本 |
| --------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------- | ----------- | ---- |
| name            | 表格字段名称                                                                             | `NamePath`                                    | -           | -    |
| formItemProps   | 表格的 `FormItemProps`                                                                   | -                                             | -           | -    |
| tableNamePath   | 表格全路径字段名称，一般在嵌套多层 `Form.List` 时使用                                    | `InternalNamePath`                            | -           | -    |
| readonly        | 表格是否只读                                                                             | `boolean`                                     | -           | -    |
| columns         | 表格列配置                                                                               | [EditableColumnsType[]](#editablecolumnstype) | -           | -    |
| actionRef       | 外部控制 EditableTable 编辑行的 ref                                                      | [EditableTableActionType](#actionref)         | -           | -    |
| editableRowKeys | 表格行可编辑状态控制                                                                     | `(string \| number)[]`                        | -           | -    |
| onTableChange   | 即 `Table` 的 [onChange](https://ant-design.antgroup.com/components/table-cn#table) 事件 | -                                             | -           | -    |
| value           | 表格数据                                                                                 | `RecordType[]`                                | -           | -    |
| onChange        | 表格数据变化时触发                                                                       | -                                             | -           | -    |
| defaultFormItem | 表格列默认表单控件配置                                                                   | -                                             | `<Input />` | -    |

除此之外，你仍然可以使用 `Table` 的其他 API 能力。

### EditableColumnsType

主要扩展点：

- dataIndex 改造为 `NamePath`
- 增加 isEditable 属性表示当前列是否可编辑
- render 改造为只读模式下的组件渲染，新增 renderFormItem 用于可编辑模式下的表单控件渲染

| 属性           | 说明                                 | 类型                                                           | 默认值 | 版本 |
| -------------- | ------------------------------------ | -------------------------------------------------------------- | ------ | ---- |
| dataIndex      | 当前列在表单中的字段名称             | `NamePath`                                                     | -      | -    |
| isEditable     | 当前列是否可编辑                     | `boolean`                                                      | true   | -    |
| render         | 当前列在只读状态下的自定义渲染函数   | function(value, record, index, [extraParams](#extraparams)) {} | -      | -    |
| renderFormItem | 当前列在可编辑状态下的自定义渲染函数 | function(value, record, index, [extraParams](#extraparams)) {} | -      | -    |
| formItemProps  | 当前列的 `FormItemProps`             | `Omit<FormItemProps, 'label' \| 'noStyle'>`                    | -      | -    |

#### extraParams

| 属性          | 说明                                                         | 类型                | 默认值 | 版本 |
| ------------- | ------------------------------------------------------------ | ------------------- | ------ | ---- |
| form          | form 实例                                                    | `FormInstance<any>` | -      | -    |
| rowNameIndex  | 当前行在数据中的索引值                                       | `number`            | -      | -    |
| rowNamePath   | 当前行的 name 路径                                           | `InternalNamePath`  | -      | -    |
| tableNamePath | 表格全路径字段名称，与 EditableTable 中的 tableNamePath 相同 | `InternalNamePath`  | -      | -    |

### actionRef

`actionRef` 提供了一些对编辑行的操作能力，方便开发者在外部不通过 `form` 来控制表格的编辑行记录。

| 属性             | 说明               | 类型                                                   | 默认值 | 版本 |
| ---------------- | ------------------ | ------------------------------------------------------ | ------ | ---- |
| addEditRecord    | 添加一条编辑行记录 | `function(data?: RecordType, insertIndex?: number) {}` | -      | -    |
| removeEditRecord | 删除一条编辑行记录 | `function(rowIndex: number) {}`                        | -      | -    |
