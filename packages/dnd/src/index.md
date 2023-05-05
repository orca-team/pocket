---
nav:
  title: 重型组件
  path: /pro-component
title: DnD 拖拽
---

# DnD 拖拽组件

`npm i @orca-fe/dnd`

`yarn add @orca-fe/dnd`

基于 [dnd-kit](https://dndkit.com/) 实现的更贴合业务功能开发的组件集合

# SortableList 可拖拽排序列表

## 功能简介

可拖拽排序列表，最简单的拖拽排序实现。

## 示例

<code src="./demo/Demo1.tsx"></code>
<code src="./demo/Demo2.tsx"></code>

## API

### TransformerBox

| 属性名称     | 描述               | 类型     | 默认值 | 版本号 |
| ------------ | ------------------ | -------- | ------ | ------ |
| defaultData  | 默认数据（非受控） | Object[] | []     |        |
| data         | 数据               | Object[] | []     |        |
| onChange     | 数据变化事件       | function | -      |        |
| children     | 渲染自定义子节点   | function | -      |        |
| customHandle | 是否自定义拖拽按钮 | boolean  | false  |        |
