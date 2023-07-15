---
title: useManualScroll 通过交互触发滚动的事件管理

group:
  title: hooks
  path: /base
---

# useManualScroll 手动触发滚动

这是一个能够让你手动控制滚动事件的 hook

## 基本使用

<code title="基本使用" src="../demo/useManualScroll/basic.tsx"></code>

## API

```ts | pure
const { run, scrollToLeft, scrollToRight, scrollToTop, scrollToBottom } = useManualScroll(target, options);
```

## Params

| 属性    | 说明                  | 类型                     | 默认值 | 版本 |
| ------- | --------------------- | ------------------------ | ------ | ---- |
| target  | DOM 节点或者 Ref 对象 | `BasicTarget`            | `-`    | `-`  |
| options | 额外的配置项          | `UseManualScrollOptions` | `-`    | `-`  |

### UseManualScrollOptions

| 属性       | 说明                     | 类型     | 默认值 | 版本 |
| ---------- | ------------------------ | -------- | ------ | ---- |
| scrollStep | 每次触发的滚动量（正数） | `number` | `200`  | `-`  |
| duration   | 滚动时长，单位毫秒       | `number` | `300`  | `-`  |

## Result

| 参数           | 说明             | 类型                                         | 默认值  | 版本 |
| -------------- | ---------------- | -------------------------------------------- | ------- | ---- |
| run            | 触发容器元素滚动 | `(direction: ManualScrollDirection) => void` | `-`     | `-`  |
| scrollToLeft   | 是否滚动至最左侧 | `boolean`                                    | `true`  | `-`  |
| scrollToRight  | 是否滚动至最右侧 | `boolean`                                    | `false` | `-`  |
| scrollToTop    | 是否滚动至顶部   | `boolean`                                    | `true`  | `-`  |
| scrollToBottom | 是否滚动至底部   | `boolean`                                    | `false` | `-`  |
