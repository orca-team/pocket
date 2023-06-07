---
title: TextOverflow 溢出文本滚动

group:
  title: 基础组件
  path: /base
---

# TextOverflow 溢出文本滚动

`@orca-fe/pocket@1.16.0`

填入内容，当容器无法完整显示内容时，进行来回滚动展示

## 示例

### 基础用法

```tsx
import React, { useState } from 'react';
import { TextOverflow } from '@orca-fe/pocket';

export default () => {
  return (
    <div style={{ width: 400, border: '1px solid #DDDDDD' }}>
      <TextOverflow>当容器无法完整显示内容时，进行来回滚动展示</TextOverflow>
      <TextOverflow align="center">内容居中</TextOverflow>
      <TextOverflow align="right">内容右对齐，你只能通过 align 调整</TextOverflow>
      <TextOverflow>填入内容，当容器无法完整显示内容时，进行来回滚动展示 填入内容，当容器无法完整显示内容时，进行来回滚动展示</TextOverflow>
    </div>
  );
};
```

## API

| 属性         | 说明                               | 类型                              | 默认值   |
| ------------ | ---------------------------------- | --------------------------------- | -------- |
| align        | 对齐（仅当内容没有溢出的时候有效） | `'left'` / `'center'` / `'right'` | `'left'` |
| pauseOnHover | 是否在 hover 的时候暂停滚动        | `boolean`                         | `true`   |
| contentStyle | 内容样式                           | `React.CSSProperties`             | -        |
