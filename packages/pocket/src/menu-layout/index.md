---
title: MenuLayout 菜单布局
nav:
  title: Pocket 组件
  path: /component
group:
  title: Layout
  path: /layout
---

# MenuLayout 菜单布局

常用的基础菜单功能

## 示例

### 基础用法

<code src="./demo/Demo1.tsx"></code>

### 通过属性控制菜单样式

<code src="./demo/Demo2.tsx"></code>

## API

| 属性          | 说明                 | 类型                                | 默认值      |
| ------------- | -------------------- | ----------------------------------- | ----------- |
| width         | 内部尺寸的宽度       | `number`                            | -           |
| height        | 内部尺寸的高度       | `number`                            | -           |
| mode          | 缩放模式             | `"contain"` \| `"cover"`            | `"contain"` |
| xAlign        | 水平排列 align       | `"left"` \| `"right"` \| `"center"` | `"center"`  |
| yAlign        | 垂直排列 align       | `"top"` \| `"bottom"` \| `"center"` | `"center"`  |
| scaleMode     | 是否拉伸内容         | `boolean`                           | `true`      |
| onRatioChange | 容器缩放比例变化事件 | `(ratio: number) => void`           | -           |
