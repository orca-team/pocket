---
title: useAnimationFrame
nav:
  title: Hooks
  path: /hooks
group:
  title: hooks
  path: /base
---

# useAnimationFrame

在函数组件中，基于[`requestAnimationFrame`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)得到一个持续的回调事件。

每次调用`requestAnimationFrame`并触发回调时，你可以得到当前经过的时间及距离上一帧间隔的时间

## 示例

```javascript
import React from 'react';
import { useAnimationFrame } from '@orca-fe/hooks';

export default () => {
  useAnimationFrame((time, frameTime) => {
    // do something
    // time 持续时间
    // frameTime 距离上一帧的时间
  });
  return <div></div>;
};
```

## API

### Props

| 属性      | 说明               | 类型     | 默认值 |
| --------- | ------------------ | -------- | ------ |
| time      | 持续时间           | `number` | -      |
| frameTime | 距离上一帧执行时间 | `number` | -      |
