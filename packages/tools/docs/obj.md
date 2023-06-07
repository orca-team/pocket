---
title: Object 对象相关

group:
  title: 基础工具
  path: /base
---

# Object 对象相关工具集

## objFilter 对象内容过滤器

```ts
/**
 * 对象内容过滤器，类似数组的 filter
 * @param obj 对象本身
 * @param callback 过滤器回调
 */
function objFilter<T extends Object>(obj: T, callback: (key: string, value: any) => boolean): Object;
```

```tsx
import React from 'react';
import moment from 'moment';
import ReactJson from 'react-json-view';
import { objFilter } from '@orca-fe/tools';

const originObject = {
  value: 123,
  key: 'object',
  name: 'abc',
  desc: undefined,
  phone: 123456789,
  detail: undefined,
};

export default () => (
  <div>
    原始对象：
    <ReactJson src={originObject} />
    过滤 undefined 后的值：
    <ReactJson src={objFilter(originObject, (key, value) => value !== undefined)} />
  </div>
);
```

## objMap 对象映射

```ts
/**
 * 对象映射，类似数组的 map
 * @param obj 对象本身
 * @param callback 遍历回调
 */
function objMap<T extends Object>(obj: T, callback: (key: string, value: any) => any): Object;
```

```tsx
import React from 'react';
import moment from 'moment';
import ReactJson from 'react-json-view';
import { objMap } from '@orca-fe/tools';

const originObject = {
  value: 123,
  key: 'object',
  name: 'abc',
  desc: undefined,
  phone: 123456789,
  detail: undefined,
};

export default () => (
  <div>
    原始对象：
    <ReactJson src={originObject} />
    将所有的值改为字符串类型：
    <ReactJson src={objMap(originObject, (key, value) => String(value))} />
  </div>
);
```
