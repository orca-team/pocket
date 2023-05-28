---
title: Number 数字相关
nav:
  title: Tools
  path: /tools
group:
  title: 基础工具
  path: /base
---

# Number 数字相关工具集

## clamp 限制最大值&最小值

```ts | pure
/**
 * 把一个值限制在一个上限和下限之间
 * @param _num 当前数字
 * @param lower 最小值
 * @param upper 最大值
 */
export function clamp(_num: number, lower?: number, upper?: number): number;
```

```tsx
import React, { useState } from 'react';
import { Slider } from 'antd';
import { clamp } from '@orca-fe/tools';

export default () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <Slider min={-100} max={100} value={value} onChange={setValue} />
      <div>调整值以查看结果</div>
      <pre>
        <code>{`clamp(${value}, -30, 50) = ${clamp(value, -30, 50)}`}</code>
      </pre>
    </div>
  );
};
```

## mix

```ts | pure
/**
 * x * (1 - a) + y * a
 * @param x
 * @param y
 * @param a
 */
export function mix(x: number, y: number, a: number): number;
```

## toFixedNumber 保留小数

```ts | pure
/**
 * 对 number 进行保留小数运算，再转换为 number 类型
 * 作用是可以确保数字不会因为计算精度问题而出现类似 0.000000001 这样的数
 * 但由于输出的是 number 类型，所以你无法要求小数为 0 时，仍保留小数精度
 * @param num 传入的数字
 * @param fractionDigits 保留小数位数
 */
function toFixedNumber(num: any, fractionDigits?: number): number;
```

```tsx
import React from 'react';
import { toFixedNumber } from '@orca-fe/tools';

export default () => (
  <div>
    <div>正常的运算</div>
    <div>{`0.1 + 0.2 = ${0.1 + 0.2}`}</div>
    <div>toFixedNumber</div>
    <div>{`0.1 + 0.2 = ${toFixedNumber(0.1 + 0.2, 1)}`}</div>
  </div>
);
```

## decimalLength 小数长度

```tsx | pure
/**
 * 获取某个 number 的小数长度
 * @param value
 */
function decimalLength(value: number): value;
```

```tsx
import React, { useState } from 'react';
import { decimalLength } from '@orca-fe/tools';

export default () => {
  return (
    <div>
      {[100, 1, 1.1, 1.5, 1.24, 2.342, 0.3546, 0.1254151].map((value) => {
        return <div key={value}>{`${value} 的小数长度为 ${decimalLength(value)}`}</div>;
      })}
    </div>
  );
};
```

## roundBy / floorBy / ceilBy

```tsx | pure
/**
 * 创建一个支持基于某个除数取整的函数
 * roundBy 四舍五入取整
 * floorBy 向下取整
 * ceilBy 向上取整
 *
 * @param divisor 除数
 * @param offset 偏移量
 */
function roundBy(divisor: number, offset?: number): (value: number) => number;
```

```tsx
/**
 * title: 不同除数下的表现
 */
import React, { useState } from 'react';
import { Slider } from 'antd';
import { roundBy } from '@orca-fe/tools';

const round1 = roundBy(1);
const round10 = roundBy(10);
const round50 = roundBy(50);
const round_5 = roundBy(0.5);
const round_1 = roundBy(0.1);
const round_03 = roundBy(0.03);
const round_01 = roundBy(0.01);

export default () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <Slider min={-100} max={100} step={0.01} value={value} onChange={setValue} />
      <div>调整值以查看不同函数下的表现</div>
      <div>{`origin value: ${value}`}</div>
      <div>{`round by 1: ${round1(value)}`}</div>
      <div>{`round by 10: ${round10(value)}`}</div>
      <div>{`round by 50: ${round50(value)}`}</div>
      <div>{`round by 0.5: ${round_5(value)}`}</div>
      <div>{`round by 0.1: ${round_1(value)}`}</div>
      <div>{`round by 0.03: ${round_03(value)}`}</div>
      <div>{`round by 0.01: ${round_01(value)}`}</div>
    </div>
  );
};
```

```tsx
/**
 * title: 不同 offset 下的表现
 * desc: 默认基于 0 取整，但如果你有不是基于 0 取整的场景，需要进行偏移，可以参考本案例
 */
import React, { useState } from 'react';
import { Slider } from 'antd';
import { roundBy } from '@orca-fe/tools';
import Clock from './Clock';

const round = roundBy(60);
const roundO30 = roundBy(60, 30);

export default () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <Slider min={-360} max={360} step={1} value={value} onChange={setValue} />
      <div>调整值以查看不同函数下的表现，基于60°取整，蓝色指针是当前角度，黄色指针是取整后的角度</div>
      <Clock p1={value} p2={round(value)} />
      <p />
      <div>下面是增加了偏移后的对比</div>
      <Clock p1={value} p2={roundO30(value)} />
    </div>
  );
};
```
