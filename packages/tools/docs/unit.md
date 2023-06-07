---
title: Unit 单位转换

group:
  title: 基础工具
  path: /base
---

# Unit 单位转换

简单的单位转换函数，将纯数字转换为带单位的数字，适用于数据展示时，数值太大需要转换的场景。

## 预设的转换方法

```tsx
import React from 'react';
import { chineseUnit, byteUnit } from '@orca-fe/tools';

export default () => (
  <div>
    <p>增加中文单位</p>
    <ul>
      {
        [1.5, 1234, 23456, 7291242321, 21512121223412].map((num, index) => (
          <li key={index}>{num} --> {chineseUnit(num).toString()}</li>
        ))
      }

    </ul>
    <p>字节单位转换</p>
    <ul>
      {
        [1.5, 1010, 2000, 8000, 65000, 7291242321, 21512121223412].map((num, index) => (
          <li key={index}>{num} --> {byteUnit(num).toString()}B</li>
        ))
      }
    </ul>
  </div>
);
```

## 创建自定义的转换方法

```tsx
import React from 'react';
import { createCovertUnitFn } from '@orca-fe/tools';

let rules = [
  { divisor: 1, unit: '秒', minValue: 0 },
  { divisor: 60, unit: '分钟', minValue: 60 },
  { divisor: 60, unit: '小时', minValue: 60 },
  { divisor: 24, unit: '天', minValue: 24 },
];

const fn = createCovertUnitFn(rules);

// 保留小数（默认保留两位小数）
const fnDecimal = createCovertUnitFn(rules, {
  precisionMode: 'fixed',
});
// 保留1位小数
const fnDecimal1 = createCovertUnitFn(rules.map(rule => ({...rule, precision: 1 })), {
  precisionMode: 'fixed',
});

export default () => (
  <div>
    <ul>
      {
        [1.5, 62, 1800, 3700, 100000, 20000000].map((num, index) => (
          <li key={index}>{num} --> {fn(num).toString()}</li>
        ))
      }
    </ul>
    <p>固定小数长度（默认为2位小数）：</p>
    <ul>
      {
        [1.5, 62, 1800, 3700, 100000, 20000000].map((num, index) => (
          <li key={index}>{num} --> {fnDecimal(num).toString()}</li>
        ))
      }
    </ul>
    <p>固定小数长度（保留1位小数）：</p>
    <ul>
      {
        [1.5, 62, 1800, 3700, 100000, 20000000].map((num, index) => (
          <li key={index}>{num} --> {fnDecimal1(num).toString()}</li>
        ))
      }
    </ul>
  </div>
);
```

## API

```ts
/**
 * 通过自定义规则创建转换函数
 * @param rules 自定义规则
 * @param options 其他转换选项
 */
function createCovertUnitFn(rules: ConvertRule[], options: ConvertOptions = {}): ConvertUnitFn;
```

### 类型定义

```ts
// 转换规则
type ConvertRule = {
  // 除数
  divisor: number;
  // 单位
  unit: string;
  // 最小值 默认和 除数 相等，可调整，达到该值后，则进行单位换算
  minValue?: number;
  // 精度（小数位数），默认为 2
  precision?: number;
};

// 转换选项
type ConvertOptions = {
  // 精度计算的方式 自动/固定 自动模式下，如果数变大，会自动减少小数位数
  precisionMode?: 'auto' | 'fixed';
};

// 转换结果
type UnitValue = {
  // 单位
  unit: string;
  // 转换后的值
  value: number;
  // 原始值
  originValue: number;
};

// 创建的转换函数
type ConvertUnitFn = (value: number) => UnitValue;
```
