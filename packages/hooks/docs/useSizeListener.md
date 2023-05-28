---
title: useSizeListener 监听元素尺寸变化
nav:
  title: Hooks
  path: /hooks
group:
  title: hooks
  path: /base
---

# useSizeListener 监听元素尺寸变化

当监听的元素发生尺寸变化时，会触发 callback 函数，并获得该元素的尺寸。

## 示例

```javascript
import React, { useRef } from 'react';
import { useSizeListener, useSizeUpdateListener } from '@orca-fe/hooks';

export default () => {
  const ref = useRef();
  useSizeListener(({ width, height }) => {
    // 当 div 的尺寸发生变化时，会触发该事件，初始化时也会触发
    console.log(width, height);
  }, ref);

  useSizeUpdateListener(({ width, height }) => {
    // 当 div 的尺寸发生变化时，会触发该事件
    console.log(width, height);
  }, ref);

  return <div ref={ref}>......</div>;
};
```

## useSizeDebounceListener

`1.2.0`

```ts
function useSizeDebounceListener(
  callback: (size: { width: number; height: number }, scale?: { x: number; y: number }) => void,
  target: BasicTarget,
  debounceInterval = 300,
): void;
```

由于 `useSizeListener` 可能会频繁触发（例如拖动窗口，触摸板缩放，动画缩放等），我们通常需要添加防抖，防止过度触发 `resize` 事件。

但添加防抖后，虽然减少了计算，提升了渲染性能，但在防抖期间的过度效果，就可能出现明显的卡顿，效果不佳。

`useSizeDebounceListener` 内置了防抖功能，并在缩放过程中，不会改变 `size` 的尺寸，只会传回 `scale`，表示在这期间缩放比例的变化。 触发防抖时，`scale` 的值为 `undefined`，此时的 `size` 才是真实尺寸。

## API

### Props

| 属性             | 说明                                               | 类型              | 默认值 |
| ---------------- | -------------------------------------------------- | ----------------- | ------ |
| width            | 宽度                                               | `number`          | -      |
| height           | 高度                                               | `number`          | -      |
| target           | 监听尺寸的对象                                     | `Ref/HTMLElement` | -      |
| debounceInterval | 防抖延迟触发的时间(`useSizeDebounceListener` 可用) | `number`          | `300`  |
