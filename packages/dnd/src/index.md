---
nav:
  title: 重型组件
  path: /pro-component
title: DnD 拖拽
toc: content
---

# DnD 拖拽组件

![npm](https://img.shields.io/npm/v/@orca-fe/dnd.svg)

`npm i @orca-fe/dnd`

`yarn add @orca-fe/dnd`

基于 [dnd-kit](https://dndkit.com/) 实现的更贴合业务功能开发的组件集合

## SortableList 可拖拽排序列表

### 功能简介

可拖拽排序列表，最简单的拖拽排序实现。

### 示例

<code src="./demo/SortableList/Demo1.tsx"></code>
<code src="./demo/SortableList/Demo2.tsx"></code>

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
| keyManager   | 自定义 key 管理器  | `KeyManager<T>`                                                  | -      |        |

## SortHandle

`SortHandle` 是一个用于快速包裹拖拽按钮的组件，使用 `SortHandle` 时，请开启 `customHandle` 属性来关闭默认的拖拽操作。

> 注意：`SortHandle` 会自动注入事件到子组件中，所以请注意你的子组件上支持响应鼠标事件。

## SortableListHelper 拖拽排序列表（与子项分离）

`0.1.0`

### 示例

<code src="./demo/SortableListHelper/Demo3.tsx"></code>

### API

| 属性名称         | 描述               | 类型                                                             | 默认值 | 版本号 |
| ---------------- | ------------------ | ---------------------------------------------------------------- | ------ | ------ |
| data             | 数据               | `Object[]`                                                       | []     |        |
| onChange         | 数据变化事件       | `(data: T[], from: number, to: number, originData: T[]) => void` | -      |        |
| children         | 子节点             | `ReactNode`                                                      | -      |        |
| customHandle     | 是否自定义拖拽按钮 | `boolean`                                                        | false  |        |
| keyManager       | 自定义 key 管理器  | `KeyManager<T>`                                                  | -      |        |
| onDragStartIndex | 拖拽开始时的下标   | `(index: number) => void`                                        | -      |        |
