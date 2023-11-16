---
title: ContextMenu 右键菜单

group:
  title: 基础组件
  path: /base
---

# ContextMenu 右键菜单

简单的自定义右键菜单实现

## 示例

### 基础用法

<code src="./demo/Demo1.tsx" ></code>

### 嵌套

<code src="./demo/Demo2.tsx" ></code>

## API

| 属性                   | 说明                               | 类型                                                              | 默认值                | 版本    |
| ---------------------- | ---------------------------------- | ----------------------------------------------------------------- | --------------------- | ------- |
| data                   | 菜单数据                           | `(ContextMenuItemType / 'split-line')[]`                          | `[]`                  |         |
| data                   | 支持回调函数的方式动态获得菜单数据 | `(target: HTMLElement) => (ContextMenuItemType / 'split-line')[]` | `[]`                  | `3.3.0` |
| onMenuClick            | 菜单点击事件                       | `(menu: ContextMenuItemType) => void`                             | -                     |         |
| getContainer           | 菜单弹出的位置                     | `(element: HTMLElement) => HTMLElement`                           | `() => document.body` |         |
| menuContainerClassName | 菜单容器的`className`              | `string`                                                          | -                     |         |
| mainMenuMinWidth       | 首层菜单的最小宽度                 | `number`                                                          | `300`                 |         |
| wrapperStyle           | 菜单容器的样式                     | `CSSProperties`                                                   | -                     |         |
| disabled               | 禁止弹出菜单                       | `boolean`                                                         | -                     |         |

### ContextMenuItemType

菜单结构

| 属性     | 说明               | 类型                                     | 默认值  | 版本    |
| -------- | ------------------ | ---------------------------------------- | ------- | ------- |
| key      | 必填：菜单唯一标识 | `string`                                 | -       |         |
| text     | 菜单内容           | `React.ReactElement` / `string`          | ''      |         |
| children | 子菜单             | `(ContextMenuItemType / 'split-line')[]` | -       |         |
| disabled | 是否禁用           | `boolean`                                | `false` |         |
| icon     | 菜单图标           | `React.ReactElement` / `string`          | -       |         |
| extra    | 菜单额外内容       | `React.ReactElement` / `string`          | -       |         |
| onClick  | 菜单点击事件       | `(event: MouseEvent) => void`            | -       | `3.3.0` |
