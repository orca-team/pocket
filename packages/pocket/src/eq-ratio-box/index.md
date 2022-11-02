---
title: EqRatioBox 等比缩放盒子
nav:
  title: Pocket 组件
  path: /component
group:
  title: 基础组件
  path: /base
---

# EqRatioBox 等比缩放盒子

你可以指定`width`/`height`属性，用于标记盒子的原始像素，盒子会根据自身实际尺寸的变化，等比放大或缩小。默认基于`width`

比如下面这个是 3x3 标尺，下面的示例中会用这个标尺作为测试用例

```tsx
import React from 'react';
import Ruler from './demo/Ruler';

export default () => <Ruler />;
```

## 示例

### 基础用法

<code src="./demo/Demo1.tsx" ></code>

### Cover 模式

<code src="./demo/Demo2.tsx" ></code>

### Cover 模式 (禁用 ScaleMode)

<code src="./demo/Demo3.tsx" ></code>

## API

| 属性          | 说明                 | 类型                              | 默认值      |
| ------------- | -------------------- | --------------------------------- | ----------- |
| width         | 内部尺寸的宽度       | `number`                          | -           |
| height        | 内部尺寸的高度       | `number`                          | -           |
| mode          | 缩放模式             | `"contain"` / `"cover"`           | `"contain"` |
| xAlign        | 水平排列 align       | `"left"` / `"right"` / `"center"` | `"center"`  |
| yAlign        | 垂直排列 align       | `"top"` / `"bottom"` / `"center"` | `"center"`  |
| scaleMode     | 是否拉伸内容         | `boolean`                         | `true`      |
| onRatioChange | 容器缩放比例变化事件 | `(ratio: number) => void`         | -           |
