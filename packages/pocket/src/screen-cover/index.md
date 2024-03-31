---
title: ScreenCover 全屏覆盖组件

group:
  title: 基础组件
  path: /base
---

# ScreenCover

全屏覆盖组件

## 何时使用

当你不需要使用 `Modal` 来进行操作和提示，但又需要一个可以覆盖全屏的组件时，可以使用 `ScreenCover`。

## 代码演示

<code title="基本用法" src="./demo/basic.tsx"></code>
<code title="使用 position 调整内容位置" src="./demo/position.tsx"></code>

## API

| 属性           | 说明               | 类型                                                      | 默认值  |
| -------------- | ------------------ | --------------------------------------------------------- | ------- |
| visible        | 是否可见           | `boolean`                                                 | `false` |
| mask           | 是否显示遮罩层     | `boolean`                                                 | `true`  |
| bodyScrollLock | 是否锁定 body 滚动 | `boolean \| 'x' \| 'y'`                                   | `true`  |
| position       | 内容位置           | [ScreenCoverContentPosition](#screencovercontentposition) | -       |
| zIndex         | 层级               | `number`                                                  | 1000    |

### bodyScrollLock

`bodyScrollLock` 用于控制全屏覆盖时是否锁定 body 的滚动条，默认锁定。

- `true`：锁定 body 滚动条
- `false`：不锁定 body 滚动条
- `'x'`：锁定 body 水平滚动条
- `'y'`：锁定 body 垂直滚动条

### ScreenCoverContentPosition

`position` 属性控制内容区的位置，默认为水平垂直居中。

| 属性 | 说明       | 类型               | 默认值 |
| ---- | ---------- | ------------------ | ------ |
| top  | 顶部偏移量 | `number \| string` | -      |
| left | 左侧偏移量 | `number \| string` | -      |
