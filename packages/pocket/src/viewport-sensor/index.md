---
title: ViewportSensor 视图管理工具
nav:
  title: Pocket 组件
  path: /component
group:
  title: 基础组件
  path: /base
---

# ViewportSensor 视图管理工具

视图管理器，是一个通过响应鼠标事件，并换算成缩放比例(`zoom`)和偏移量(`center`)。

这只是一个基础工具，一般需要结合该工具进行更复杂的内容开发

## 类型定义

### Viewport

```ts | pure
type Viewport = {
  center: [number, number];
  zoom: number;
};
```

## API

| 属性              | 说明                                                                                                                                                 | 类型                                  | 默认值   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | -------- |
| center            | 中心点偏移量                                                                                                                                         | `[number, number]`                    | `-`      |
| zoom              | 缩放比例                                                                                                                                             | `number`                              | `0`      |
| beforePointerDown | 开始拖拽事件，可以在这里返回 `false` 以中断拖拽                                                                                                      | `(e: MjolnirPointerEvent) => boolean` | `-`      |
| onPropsChange     | 视图变化事件，`viewport` 中包含了 `center` 和 `zoom`                                                                                                 | `(viewport: Viewport) => void`        | `-`      |
| maxZoom           | 最大缩放级别，通过 `2 ** maxZoom` 换算成缩放比例                                                                                                     | `number`                              | `10`     |
| maxZoomStep       | 最大缩放步进，默认情况下，滚轮缩放得到的 `delta` 是 100 太大了，通过这里限制以获得更好的体验                                                         | `number`                              | `0.3`    |
| zoomStep          | 滚轮缩放 1 像素时，缩放比例变化的步进，要注意触摸板缩放也是通过这里计算的                                                                            | `number`                              | `0.02`   |
| minZoom           | 最小缩放级别，通过 `2 ** minZoom` 换算成缩放比例                                                                                                     | `number`                              | `-10`    |
| wheelMode         | 当进行鼠标滚轮操作（触摸板双指滚动也会触发）时要执行的操作，缩放或平移。如果选择了平移('move')，则需要按住 `Ctrl` 实现缩放，触摸板则通过双指捏合缩放 | `'zoom' / 'move'`                     | `'zoom'` |
