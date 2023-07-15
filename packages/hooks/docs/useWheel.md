---
title: useWheel 鼠标滚轮事件管理

group:
  title: hooks
  path: /base
---

# useWheel 鼠标滚轮事件管理

这是一个能够帮助你管理鼠标滚轮事件的 hooks ，它能帮你获取到当前滚轮的滚动状态及其相关的滚动数据。

## 基本使用

<code title="基本使用" src="../demo/useWheel/basic.tsx"></code>

## 结合 useManualScroll 实现滚轮事件的横向滚动

<code title="上下滚轮实现横向滚动" src="../demo/useWheel/horizScroll.tsx"></code>

## API

```ts | pure
function useWheel(target: BasicTarget, options: UseWheelOptions = {}): WheelScrollState;
```

### BasicTarget

滚动容器对象，可以是 `RefObject` 或 `Element`

### UseWheelOptions

| 属性  | 说明                                                     | 类型     | 默认值 | 版本 |
| ----- | -------------------------------------------------------- | -------- | ------ | ---- |
| delay | 判断滚轮停止滚动时的延迟毫秒数，默认最小延迟毫秒数 300ms | `number` | `300`  | `-`  |

### WheelScrollState

| 属性      | 说明                 | 类型                                          | 默认值  | 版本 |
| --------- | -------------------- | --------------------------------------------- | ------- | ---- |
| rolling   | 滚动中               | `boolean`                                     | `false` | `-`  |
| direction | 滚轮滚动方向         | `up` \| `down` \| `left` \| `right` \| `null` | `null`  | `-`  |
| movement  | 当前滚轮滚动量       | `number`                                      | `0`     | `-`  |
| distance  | 本次滚动累计滚动距离 | `number`                                      | `0`     | `-`  |
