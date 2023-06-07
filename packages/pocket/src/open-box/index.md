---
title: OpenBox 展开收起容器

group:
  title: 基础组件
  path: /base
---

# OpenBox 展开收起容器

`open-box` 可以在两个模式（展开/收起）之间切换，展开模式会自动将容器调整为内容的高度，而收起会将容器自动调整为固定高度。

## 示例

### 基础用法

```tsx
import React, { useState } from 'react';
import { OpenBox } from '@orca-fe/pocket';
import { Button } from 'antd';

const Demo = (props) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Button onClick={() => setOpen(!open)}>Toggle</Button>
      <OpenBox open={open} style={{ border: '1px solid #CCCCCC' }}>
        <div>我是里面的内容</div>
        <div>可能有比较多内容</div>
        <div>有很多很多内容</div>
        <div>组件可以展开或收起</div>
      </OpenBox>
    </div>
  );
};

export default Demo;
```

### 指定高度

设置 height 属性，控制收起时的固定高度

```tsx
import React, { useState } from 'react';
import { OpenBox } from '@orca-fe/pocket';
import { Button } from 'antd';

const Demo = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(!open)}>{open ? '收起' : '展开更多'}</Button>
      <OpenBox height={50} open={open} style={{ border: '1px solid #CCCCCC', lineHeight: '50px' }}>
        <div>我是第一行内容</div>
        <div>更多的内容</div>
        <div>更多的内容更多的内容更多的内容更多的内容更多的内容更多的内容更多的内容更多的内容更多的内容更多的内容更多的内容更多的内容</div>
        <div>更多的内容</div>
        <div>更多的内容</div>
        <div>更多的内容</div>
        <div>更多的内容</div>
      </OpenBox>
    </div>
  );
};

export default Demo;
```

## API

| 属性   | 说明         | 类型      | 默认值 |
| ------ | ------------ | --------- | ------ |
| height | 收起时的高度 | `number`  | 0      |
| open   | 是否展开     | `boolean` | -      |
