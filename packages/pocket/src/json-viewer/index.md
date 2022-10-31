---
title: JsonViewer JSON预览器
nav:
  title: Pocket 组件
  path: /component
group:
  title: 基础组件
  path: /base
---

# JsonViewer JSON 预览器

类似 Chrome debugger 的 JSON 可视化视图

## 示例

### 基础用法

<code src="./demo/Demo1.tsx" ></code>

## API

| 属性        | 说明                                                                                                                                                             | 类型                                                                         | 默认值  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------- |
| value       | 需要渲染的 JSON 值                                                                                                                                               | `any`                                                                        | -       |
| editable    | 是否可编辑                                                                                                                                                       | `boolean`                                                                    | `false` |
| defaultOpen | 默认展开的层数，这里支持 3 种配置方式：使用`boolean`类型控制所有节点的默认展开状态；使用`number`类型控制展开至特定深度；使用`function`对每一个节点做更细致的控制 | `number` / `boolean` / `((node: any, path: (string / number)[]) => boolean)` | `1`     |
| onChange    | JSON 修改事件                                                                                                                                                    | `(value: T, e: ValueChangeType<T>) => void`                                  | -       |
