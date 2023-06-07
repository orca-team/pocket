---
title: LoadMore 动态加载更多

group:
  title: 基础组件
  path: /base
---

# LoadMore 动态加载更多

`2.3.0`

> 注意：该组件还在实验阶段，请谨慎使用。

这是一个支持识别滚动位置的 `div` 容器，你需要为它设置一个固定高度，当滚动到底部时，会根据当前状态，触发 `onLoadMore` 事件，你可以在这个事件中去加载更多的数据。

组件不会帮你渲染列表的内容，你需要自己去实现，组件只负责识别滚动位置，触发事件。

你应该将列表内容放在 `LoadMore` 组件的子元素中，这样组件才能让组件实现无线滚动的效果

## 使用示例

```tsx | pure
// TODO
```

## ReactScript Props

| 属性             | 描述                                                                         | 类型                                                                     | 默认值           | 版本号 |
| ---------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------- | ------ |
| loading          | loading 状态                                                                 | `boolean`                                                                | `-`              | -      |
| loadingComponent | 自定义 loading 内容                                                          | `React.ReactNode`                                                        | `'Loading...'`   | -      |
| onLoadingChange  | loading 状态变化事件                                                         | `(loading: boolean) => void`                                             | `-`              | -      |
| hasMore          | 是否还有更多                                                                 | `boolean`                                                                | `-`              | -      |
| onHasMoreChange  | 是否还有更多变化事件(非受控模式下生效)                                       | `(hasMore: boolean) => void`                                             | `-`              | -      |
| onLoadMore       | 加载更多事件                                                                 | `(pageNum: number) => Promise<false \| unknown> \| boolean \| undefined` | `-`              | -      |
| loadOnMount      | 组件初始化时自动加载                                                         | `boolean`                                                                | `true`           | -      |
| defaultPage      | 默认页码                                                                     | `number`                                                                 | `-`              | -      |
| page             | 当前页码                                                                     | `number`                                                                 | `-`              | -      |
| onPageChange     | 页码变化事件                                                                 | `(page: number) => void`                                                 | `-`              | -      |
| disabled         | 禁用无限加载                                                                 | `boolean`                                                                | `false`          | -      |
| loadMoreText     | 加载更多文案                                                                 | `string`                                                                 | `'下拉加载更多'` | -      |
| noMoreText       | 无更多内容文案                                                               | `string`                                                                 | `'没有更多了'`   | -      |
| loadingDelay     | loading 状态变化延时（防止状态变化过快，在页面未完成加载时又加载了下一页数据 | `number`                                                                 | `500`            | -      |
| hideNoMore       | 当没有更多的时候，隐藏提示信息                                               | `boolean`                                                                | `false`          | -      |
