---
title: Transformer
nav:
  title: 重型组件
  path: /pro-component
group:
  title: Transformer
  path: /transformer
---

# Transformer

`npm i @orca-fe/transformer***REMOVED***`

`yarn add @orca-fe/transformer***REMOVED***`

## 功能简介

### TransformerBox

为你的内容添加一个可拖拽的边框，`absolute` 定位，支持位置、尺寸、旋转角度的变化。默认不支持旋转，需要手动开启。

### TransformerLayout

这是一个 `TransformerBox` 的集合，你可以在这里管理多个可拖拽的边框。

## 示例

### 基础用法

<code src="../demo/DemoDev.tsx" ></code>

<code src="../demo/Demo1.tsx" ></code>

<code src="../demo/Demo2.tsx" ></code>

## API

### TransformerBox

| 属性名称        | 描述                                                                                                      | 类型                                   | 默认值  | 版本号 |
| --------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------- | ------ |
| disabled        | 是否禁用                                                                                                  | `boolean`                              | `false` |        |
| checked         | 是否选中状态，选中状态下，才可以进行边框调整                                                              | `boolean`                              | `false` |        |
| minDragDistance | 最小拖动距离                                                                                              | `number`                               | `4`     |        |
| defaultBounds   | 默认的 Bounds 信息                                                                                        | `Bounds`                               | -       |        |
| bounds          | Bounds 信息                                                                                               | `Bounds`                               | -       |        |
| onChangeStart   | 开始拖动时的回调函数                                                                                      | `(e: Event, type: ResizeType) => void` | -       |        |
| onDragBefore    | 拖动前的回调函数                                                                                          | `(e: MouseEvent) => boolean`           | -       |        |
| onBoundsChange  | Bounds 信息变化时的回调函数                                                                               | `(bounds: Bounds) => void`             | -       |        |
| onChangeEnd     | 结束拖动时的回调函数                                                                                      | `() => void`                           | -       |        |
| onClickFixed    | 静态点击（非拖拽）时的回调函数                                                                            | `(e: MouseEvent) => void`              | -       |        |
| controlledMode  | 是否受控模式，开启后，拖拽的过程，会实时触发 onBoundsChange                                               | `boolean`                              | `false` |        |
| portal          | 修改内容挂载点，默认挂载到边框内部。指定内挂载位置，可实现渲染多个 Box 时，内容不会遮挡边框，造成效果不佳 | `() => HTMLElement`                    | -       |        |
| limitBounds     | 限制移动区域，设置之后，会以中心点为基准，不能移动超过 limitBounds 的范围                                 | `Bounds`                               | -       |        |
| rotateEnable    | 支持旋转                                                                                                  | `boolean`                              | `false` |        |

### TransformerLayout

| 属性名称            | 描述                                                                                                                                        | 类型                                                   | 默认值                            | 版本号  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------- | ------- | --- |
| defaultData         | 默认边框数据列表                                                                                                                            | `T[]`                                                  | -                                 | -       |
| data                | 边框数据列表                                                                                                                                | `T[]`                                                  | -                                 | -       |
| onDataChange        | 数据列表发生变化时的回调                                                                                                                    | `(data: T[], action: 'change'                          | 'delete', index: number) => void` | -       | -   |
| children            | 渲染自定义子元素                                                                                                                            | `(item: T, index: number) => React.ReactNode`          | -                                 | -       |
| defaultCheckedIndex | 默认选中的元素下标                                                                                                                          | `number`                                               | -                                 | -       |
| checkedIndex        | 选中的元素下标                                                                                                                              | `number`                                               | -                                 | -       |
| onCheck             | 选中元素变化时的回调                                                                                                                        | `(index: number) => void`                              | -                                 | -       |
| clickAwayWhitelist  | 点击白名单，当点击组件之外的元素时，会默认取消选中，如果你需要点击弹框之类的挂载在 body 下的元素，且不希望取消选中，可以考虑这个属性        | `BasicTarget[]`                                        | `[]`                              | -       |
| limit               | 是否限制元素移动范围，开启后，边框将不能拖拽到本组件之外的地方（以中心点为基准）                                                            | `boolean`                                              | `false`                           | -       |
| layoutEvents        | 是否开启布局 div 事件，为了实现空白区域的事件穿透（即不会挡住画布后面的内容），默认去除了画布上的点击事件响应，如果你需要开启，则使用该属性 | `boolean`                                              | `false`                           | -       |
| zoom                | 缩放比例 scale = 2 \*\* zoom                                                                                                                | `number`                                               | `1`                               | -       |
| rotateEnable        | 是否支持 Box 旋转                                                                                                                           | `boolean`                                              | `false`                           | -       |
| onDelete            | 删除事件， return false 可以终止删除                                                                                                        | `(index: number) => void / boolean / Promise<boolean>` | `-`                               | `0.0.7` |
