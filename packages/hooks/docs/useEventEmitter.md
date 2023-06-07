---
title: useEventEmitter 事件管理器

group:
  title: hooks
  path: /base
---

# useEventEmitter 事件管理器

基于[EventEmitter](https://www.npmjs.com/package/events)封装的事件管理钩子，接管了 `on` / `off`，使用 `hooks` 的方式进行事件监听。

通常在最外层 Provider 中声明，并为子组件提供跨组件事件通信的能力。

## 示例

```javascript
import React from 'react';
import { useEventEmitter } from '@orca-fe/hooks';

export default () => {
  const events = useEventEmitter();

  events.useSubscription('click', (e) => {
    console.log('click event');
  });

  return (
    <div
      onClick={(e) => {
        events.emit('click', e);
      }}
    >
      Click me
    </div>
  );
};
```

## API

### Props

| 属性            | 说明                           | 类型       | 默认值 |
| --------------- | ------------------------------ | ---------- | ------ |
| emit            | 向管理器触发事件               | `function` | -      |
| useSubscription | 安全地使用 `on`/`off` 监听事件 | `function` | -      |
