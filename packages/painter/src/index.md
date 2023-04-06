---
title: 画布 Painter
nav:
  title: 重型组件
  path: /pro-component
---

# 画布 Painter

![npm](https://img.shields.io/npm/v/@orca-fe/painter.svg)

`npm i @orca-fe/painter`

`yarn add @orca-fe/painter`

## 功能简介

画布 Painter 是一个基于 React 的画布组件，使用 Svg 实现，支持绘制矩形、圆形、多边形、折线、曲线、图片等。

## 示例

### 基础用法

<code src="../demo/DemoDev.tsx" ></code>

<code src="../demo/Demo1.tsx" ></code>

## API

### 属性

| 属性名称               | 描述                   | 类型                                                                                  | 默认值         | 版本号  |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------- | -------------- | ------- |
| zoom                   | 缩放比例               | `number`                                                                              |                |         |
| defaultDrawMode        | 默认绘画模式           | `DrawMode`                                                                            | `DrawMode.PEN` |         |
| defaultData            | 默认图形数据           | `ShapeDataType[]`                                                                     | `[]`           |         |
| data                   | 图形数据               | `ShapeDataType[]`                                                                     | `[]`           |         |
| onDataChange           | 图形数据变化回调       | `(data: ShapeDataType[], action: 'add' / 'change' / 'delete', index: number) => void` |                |         |
| renderTransformingRect | 渲染变换框             | `(shape: T, index: number) => React.ReactNode`                                        |                |         |
| defaultChecked         | 默认选中项             | `number`                                                                              | `-1`           |         |
| checked                | 选中项                 | `number`                                                                              | `-1`           |         |
| onCheck                | 选中项变化回调         | `(checked: number) => void`                                                           |                |         |
| autoCheck              | 自动选择最后创建的元素 | `boolean`                                                                             | `false`        | `1.1.0` |

### PainterRef

使用 `usePainterRef` 获得 Painter 实例

`const painterRef = usePainterRef();`

| 方法名     | 描述         | 参数                                                 | 返回值                 | 版本号 |
| ---------- | ------------ | ---------------------------------------------------- | ---------------------- | ------ |
| draw       | 绘制图形     | `shapeType: ShapeType`, `attr?: Record<string, any>` | `void`                 |        |
| cancelDraw | 取消绘制     | 无                                                   | `void`                 |        |
| isDrawing  | 是否正在绘制 | 无                                                   | `boolean`              |        |
| getRoot    | 获取根元素   | 无                                                   | `HTMLElement` / `null` |        |
