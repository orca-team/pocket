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

- 需要一键切换表格的 **只读** 和 **可编辑** 模式
- 需要与 `Form.List` 进行嵌套使用

## 代码演示

<code title="基础用法" src="./demo/basic.tsx"></code>

<code title="结合分页使用" src="./demo/pagination.tsx"></code>

<code title="受控使用" src="./demo/controlled.tsx"></code>
