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

## API

### Props

| 属性   | 说明 | 类型     | 默认值 |
| ------ | ---- | -------- | ------ |
| width  | 宽度 | `number` | -      |
| height | 高度 | `number` | -      |
