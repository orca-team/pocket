---
title: useWindowSize 监听窗口尺寸变化
nav:
  title: Hooks
  path: /hooks
group:
  title: hooks
  path: /base
---

# useWindowSize 监听窗口尺寸变化

当浏览器窗口发生变化时，会触发函数组件更新，并得到当前窗口的尺寸。

## 示例

```javascript
import React, { useRef } from 'react';
import { useWindowSize } from '@orca-fe/hooks';

export default () => {
  const { width, height } = useWindowSize();

  console.log(width, height);

  return <div>......</div>;
};
```

## API

### Props

| 属性   | 说明 | 类型     | 默认值 |
| ------ | ---- | -------- | ------ |
| width  | 宽度 | `number` | -      |
| height | 高度 | `number` | -      |
