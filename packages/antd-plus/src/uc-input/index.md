---
title: UcInput 非受控输入框

group:
  title: 基础组件
  path: /base
---

# UcInput 非受控输入框

基于 `antd` 的 `Input` 组件实现，区别在于组件值不再受控于 `value` 且 `onChange` 事件只在 `blur` 时或按下 `Enter` 时才触发。

## 示例

### 对比 Input

```tsx
import React, { useState } from 'react';
import { Input } from 'antd';
import { UcInput } from '@orca-fe/antd-plus';

export default () => {
  const [value, setValue] = useState('abc');
  const [ucValue, setUcValue] = useState('abd');
  return (
    <div>
      <p>请输入，对比 Input 和 UcInput</p>
      Input:
      <div>value: {value}</div>
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <p />
      UcInput:
      <div>value: {ucValue}</div>
      <UcInput
        value={ucValue}
        onChange={(value) => {
          setUcValue(value);
        }}
      />
    </div>
  );
};
```

## API

请参考 `antd` 的 (`Input` 组件文档)[https://ant.design/components/input-cn/]
