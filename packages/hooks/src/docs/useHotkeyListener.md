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

export default () => {
  useHotkeyListener('delete', () => {
    console.log('delete');
  });
  return <div>Demo</div>;
};
```
