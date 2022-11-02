---
title: EditableDiv 可编辑Div
nav:
  title: Pocket 组件
  path: /component
group:
  title: 基础组件
  path: /base
---

# EditableDiv 可编辑 Div

可编辑的 Div，最简单的内容编辑器

## 示例

### 基础用法

<code src="./demo/DemoBasic.tsx" ></code>

## API

| 属性         | 说明                                                 | 类型                         | 默认值  |
| ------------ | ---------------------------------------------------- | ---------------------------- | ------- |
| defaultValue | 默认值（非受控）                                     | `string`                     | -       |
| value        | 内容（受控）                                         | `string`                     | -       |
| onChange     | 当内容发生修改时触发                                 | `(value: string) => void`    | -       |
| editing      | 是否进入编辑状态                                     | `boolean`                    | `false` |
| onEditChange | 编辑状态将要发生变化的事件，在确定和取消编辑时会触发 | `(editing: boolean) => void` | -       |
