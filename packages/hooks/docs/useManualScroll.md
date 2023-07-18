---
title: useManualScroll 手动触发滚动

group:
  title: hooks
  path: /base
---

# useManualScroll 手动触发滚动

`useManualScroll` 在 ahooks 的 `useScroll` 基础上增加了手动触发滚动的能力，它同时透出了容器滚动时的 `position` 信息。  
在需要通过用户交互事件手动地触发滚动的场景中，`useManualScroll` 可以代替 `useScroll` 进行使用。

你可以通过配置 `shouldUpdate` 来控制是否需要更新滚动信息， 它与在 `useScroll` 中的使用是一致的。  
请注意，当 `shouldUpdate` 的结果为 `false` 时，`scrollToLeft`、`scrollToRight`、`scrollToTop`、`scrollToBottom` 的值也不会同步进行更新。

## 基本使用

<code title="基本使用" src="../demo/useManualScroll/basic.tsx"></code>

## API

```ts | pure
const { run, position, scrollToLeft, scrollToRight, scrollToTop, scrollToBottom } = useManualScroll(target, options);
```

## Params

| 属性    | 说明                  | 类型                     | 默认值 |
| ------- | --------------------- | ------------------------ | ------ |
| target  | DOM 节点或者 Ref 对象 | `BasicTarget`            | `-`    |
| options | 额外的配置项          | `UseManualScrollOptions` | `-`    |

### UseManualScrollOptions

| 属性              | 说明                 | 类型                                         | 默认值       | 版本 |
| ----------------- | -------------------- | -------------------------------------------- | ------------ | ---- |
| defaultScrollStep | 默认滚动量           | `number`                                     | `200`        | `-`  |
| duration          | 滚动时长，单位毫秒   | `number`                                     | `300`        | `-`  |
| shouldUpdate      | 控制是否更新滚动信息 | `({ top: number, left: number }) => boolean` | `() => true` | `-`  |

## Result

| 参数           | 说明                             | 类型                                                              | 默认值      |
| -------------- | -------------------------------- | ----------------------------------------------------------------- | ----------- |
| run            | 触发容器滚动（支持自定义滚动量） | `(direction: ManualScrollDirection, scrollStep?: number) => void` | `-`         |
| position       | 滚动容器当前的滚动位置           | `{ left: number, top: number } \| undefined`                      | `undefined` |
| scrollToLeft   | 是否滚动至最左侧                 | `boolean`                                                         | `true`      |
| scrollToRight  | 是否滚动至最右侧                 | `boolean`                                                         | `false`     |
| scrollToTop    | 是否滚动至顶部                   | `boolean`                                                         | `true`      |
| scrollToBottom | 是否滚动至底部                   | `boolean`                                                         | `false`     |
