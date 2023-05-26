---
title: useHotkeyListener 热键管理器
nav:
  title: Hooks
  path: /hooks
group:
  title: hooks
  path: /base
---

# useHotkeyListener 热键管理器

```tsx
import React from 'react';
import { useHotkeyListener } from '@orca-fe/hooks';
import { message } from 'antd';

export default () => {
  useHotkeyListener('delete', () => {
    message.info('delete');
  });
  useHotkeyListener('Ctrl+X', () => {
    message.info('Ctrl+X');
  });
  useHotkeyListener('Ctrl+Shift+C', () => {
    message.info('Ctrl+Shift+C');
  });
  return <div>Demo</div>;
};
```
