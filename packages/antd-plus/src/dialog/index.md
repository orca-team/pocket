---
title: Dialog 对话框

group:
  title: 基础组件
  path: /base
---

# Dialog 对话框

`1.21.0`

基础对话框组件

## 示例

### 基础用法

<code src="./demo/Demo1.tsx" ></code>

## API

| 属性           | 说明                                                           | 类型                               | 默认值                |
| -------------- | -------------------------------------------------------------- | ---------------------------------- | --------------------- |
| open           | 是否展示                                                       | `boolean`                          | `false`               |
| title          | 标题                                                           | `React.ReactNode`                  | -                     |
| center         | 居中展示                                                       | `boolean`                          | `true`                |
| top            | 对话框 top                                                     | `number`                           | `100`                 |
| left           | 对话框 left                                                    | `number`                           | `100`                 |
| width          | 对话框宽度                                                     | `number`                           | `600`                 |
| height         | 对话框高度                                                     | `number`                           | `400`                 |
| getContainer   | 获取对话框渲染的容器                                           | `() => HTMLElement`                | `() => document.body` |
| onOk           | 确定事件回调                                                   | `() => void`                       | -                     |
| onClose        | 关闭/取消事件回调                                              | `() => void`                       | -                     |
| afterClose     | 对话框彻底关闭后的事件                                         | `() => void`                       | -                     |
| destroyOnClose | 关闭后，卸载对话框中的内容                                     | `() => void`                       | -                     |
| forceRender    | 强制渲染弹框                                                   | `boolean`                          | `false`               |
| footerAlign    | 对话框脚部内容的对齐方向                                       | `'left'` / `'right'` / `'center'`  | `'right'`             |
| footer         | 自定义对话框脚部                                               | `React.ReactNode`                  | `取消` & `确定`       |
| scrollable     | 对话框内容部分是否可滚动，你可以设置为不滚动，并自己实现滚动条 | `boolean`                          | `true`                |
| size           | 弹框尺寸                                                       | `'large'` / `'middle'` / `'small'` | `'large'`             |
| zIndex         | 弹框 z-index 高度                                              | `number`                           | -                     |
| bodyClassname  | 修改 body 的 classname                                         | `string`                           | -                     |
| bodyStyle      | 修改 body 的 样式                                              | `React.CSSProperties`              | -                     |
