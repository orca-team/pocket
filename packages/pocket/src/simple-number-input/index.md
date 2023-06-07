---
title: SimpleNumberInput 简易数字输入框

group:
  title: 基础组件
  path: /base
---

# SimpleNumberInput 简易数字输入框

简单的数字输入框，在默认情况下，输入框呈只读样式，当点击数字之后，即进入编辑状态。

可以通过 `上下箭头` 来修改数字的值，或在只读状态下，通过左右拖拽调整数字值。

## 示例

### 基础用法

```tsx
import React, { useState } from 'react';
import { SimpleNumberInput } from '@orca-fe/pocket';

export default () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <div>{`value: ${value}`}</div>
      <SimpleNumberInput value={value} onChange={setValue} />
    </div>
  );
};
```

### 步进

```tsx
import React, { useState } from 'react';
import { SimpleNumberInput } from '@orca-fe/pocket';

export default () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <div>{`value: ${value}`}</div>
      <SimpleNumberInput value={value} onChange={setValue} step={10} />
    </div>
  );
};
```

### 拖拽时不触发 onChange

```tsx
import React, { useState } from 'react';
import { SimpleNumberInput } from '@orca-fe/pocket';

export default () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <div>{`value: ${value}`}</div>
      <SimpleNumberInput value={value} onChange={setValue} triggerOnDrag={false} min={-10} />
    </div>
  );
};
```

### 不可编辑

```tsx
import React from 'react';
import { SimpleNumberInput } from '@orca-fe/pocket';

export default () => {
  return (
    <div>
      <SimpleNumberInput value={12345} editable={false} />
    </div>
  );
};
```

## API

export default `shouldUpdate(MyComponent, shouldComponentUpdateFn)`;

| 属性          | 说明                     | 类型                      | 默认值 |
| ------------- | ------------------------ | ------------------------- | ------ |
| editable      | 可编辑                   | `boolean`                 | `true` |
| value         | 值                       | `number`                  | -      |
| onChange      | 回调函数                 | `(value: number) => void` | -      |
| triggerOnDrag | 拖拽过程中触发`onChange` | `boolean`                 | `true` |
| step          | 步进                     | `number`                  | `1`    |
| min           | 最小值                   | `number`                  | -      |
| max           | 最大值                   | `number`                  | -      |
