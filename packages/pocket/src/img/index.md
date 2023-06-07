---
title: Img 图片组件

group:
  title: 基础组件
  path: /base
---

# Img 图片组件

图片组件，你可以像`<img />`一样使用，不用担心图片失效时的错误样式问题。

## 示例

### 基础用法

<code src="./demo/DemoBasic.tsx" ></code>

### 自定义 Loading

<code src="./demo/DemoLoading.tsx" ></code>

### 自定义 Error

<code src="./demo/DemoError.tsx" ></code>

## API

| 属性       | 说明                                                                                                           | 类型                      | 默认值 |
| ---------- | -------------------------------------------------------------------------------------------------------------- | ------------------------- | ------ |
| src        | 与`img`的事件相同                                                                                              | `string`                  | -      |
| onLoad     | 与`img`的事件相同                                                                                              | `function`                | -      |
| onError    | 与`img`的事件相同                                                                                              | `function`                | -      |
| imgRef     | 用于传递到组件中`img`元素的`ref`                                                                               | `RefObject`               | -      |
| stretch    | 是否设置图片大小为容器尺寸？设置为`true`时，需要为组件显示地设置宽高。设置为`false`时，则和普通`img`的特性一致 | `boolean`                 | `true` |
| loadingSrc | 图片加载过程中的占位图/占位组件                                                                                | `ReactElement` / `string` | -      |
| errSrc     | 图片加载失败的占位图/占位组件                                                                                  | `ReactElement` / `string` | -      |
