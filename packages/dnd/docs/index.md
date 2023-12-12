---
nav:
  title: 重型组件
  path: /pro-component
title: DnD 拖拽
---

# DnD 拖拽组件

![npm](https://img.shields.io/npm/v/@orca-fe/dnd.svg)

`npm i @orca-fe/dnd`

`yarn add @orca-fe/dnd`

基于 [dnd-kit](https://dndkit.com/) 实现的更贴合业务功能开发的组件集合。

目前已经实现了：

- [x] SortableList 可拖拽排序列表（[简单纵向列表排序](#packages-dnd-docs-demo-demo1)）
- [x] SortableListHelper 拖拽排序列表（[复杂列表拖拽排序](#packages-dnd-docs-demo-demo3)）
- [x] SortableHelper 通用拖拽排序（[网格布局拖拽](#packages-dnd-docs-demo-demo4)）

<code src="../demo/DemoDev.tsx"></code>

## SortableList 可拖拽排序列表

### 功能简介

可拖拽排序列表，最简单的拖拽排序实现。

### 示例

<code src="../demo/SortableList/Demo1.tsx"></code>
<code src="../demo/SortableList/Demo2.tsx"></code>

### API

```ts | pure
// children 的类型，支持直接传入一个子节点（不推荐），或使用函数的方式动态渲染子节点
type SortableItemChildren<T> = React.ReactNode | ((item: T, index: number, args?: ReturnType<typeof useSortable>) => React.ReactNode);
```

| 属性名称     | 描述               | 类型                                                             | 默认值 | 版本号 |
| ------------ | ------------------ | ---------------------------------------------------------------- | ------ | ------ |
| defaultData  | 默认数据（非受控） | `Object[]`                                                       | []     |        |
| data         | 数据               | `Object[]`                                                       | []     |        |
| onChange     | 数据变化事件       | `(data: T[], from: number, to: number, originData: T[]) => void` | -      |        |
| children     | 渲染自定义子节点   | `SortableItemChildren`                                           | -      |        |
| customHandle | 是否自定义拖拽按钮 | `boolean`                                                        | false  |        |
| keyManager   | 自定义 key 管理器  | `KeyManager<T>` \| `string`                                      | -      |        |

## SortHandle

`SortHandle` 是一个用于快速包裹拖拽按钮的组件，使用 `SortHandle` 时，请开启 `customHandle` 属性来关闭默认的拖拽操作。

> 注意：`SortHandle` 会自动注入事件到子组件中，所以请注意你的子组件上支持响应鼠标事件。

## SortableListHelper 拖拽排序列表（与子项分离）

`0.1.0`

### 示例

<code src="../demo/SortableListHelper/Demo3.tsx"></code>

### API

| 属性名称         | 描述               | 类型                                                             | 默认值 | 版本号 |
| ---------------- | ------------------ | ---------------------------------------------------------------- | ------ | ------ |
| data             | 数据               | `Object[]`                                                       | []     |        |
| onChange         | 数据变化事件       | `(data: T[], from: number, to: number, originData: T[]) => void` | -      |        |
| children         | 子节点             | `ReactNode`                                                      | -      |        |
| customHandle     | 是否自定义拖拽按钮 | `boolean`                                                        | false  |        |
| keyManager       | 自定义 key 管理器  | `KeyManager<T>` \| `string`                                      | -      |        |
| onDragStartIndex | 拖拽开始时的下标   | `(index: number) => void`                                        | -      |        |

## SortableHelper

`1.0.0`

在 `1.0.0` 版本中，增加了网格布局支持，并进一步抽象了 `SortableListHelper`，变成了 `SortableHelper`
，它允许你传入拖拽排序策略，支持[文档参考](https://docs.dndkit.com/presets/sortable/sortable-context#strategy)：

- `rectSortingStrategy` 顺序网格布局（默认）
- `verticalListSortingStrategy` 纵向列表
- `horizontalListSortingStrategy` 横向列表
- `rectSwappingStrategy` 交换网格布局

### 示例

<code src="../demo/SortableHelper/Demo4.tsx"></code>
<code src="../demo/SortableHelper/Demo5.tsx"></code>

### API

| 属性名称         | 描述               | 类型                                                             | 默认值 | 版本号 |
| ---------------- | ------------------ | ---------------------------------------------------------------- | ------ | ------ |
| data             | 数据               | `Object[]`                                                       | []     |        |
| onChange         | 数据变化事件       | `(data: T[], from: number, to: number, originData: T[]) => void` | -      |        |
| children         | 子节点             | `ReactNode`                                                      | -      |        |
| customHandle     | 是否自定义拖拽按钮 | `boolean`                                                        | false  |        |
| keyManager       | 自定义 key 管理器  | `KeyManager<T>` \| `string`                                      | -      |        |
| onDragStartIndex | 拖拽开始时的下标   | `(index: number) => void`                                        | -      |        |
| strategy         | 拖拽策略           | 从 `@dnd-kits/core` 获得 `strategy`                              | -      |        |
| disabled         | 是否禁用拖拽       | `boolean`                                                        | false  | 1.0.0  |

## 跨列表拖拽

`1.2.0`

在 `1.2.0` 版本中，增加了跨列表拖拽支持。使用 `SortableHelper.SubSortable` 来渲染子列表。

### 示例

<code src="../demo/MultiSortable/MultiDemo1.tsx"></code>

### API
