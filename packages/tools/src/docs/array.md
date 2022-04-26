---
title: Array 数组相关
nav:
  title: Tools
  path: /tools
group:
  title: 基础工具
  path: /base
---

# Array 数组相关工具集

修改数组的内容但不改变原始数组，`immutable` 的思想。

## changeArr 更改数组某项的内容

```ts
/**
 * 删除数组中的某个下标，该操作和 splice 的效果类似，但不影响原数组
 * @param arr 数组本身
 * @param index 数组下标
 * @param newItem 需要替换的值
 */
function changeArr<T>(arr: T[], index: number, newItem: T): T[];
```

```tsx
import React from 'react';
import { changeArr } from '@orca-fe/tools';

const arr = [1, 2, 3, 4, 5, 6];
const newArr1 = changeArr(arr, 3, 100);
const newArr2 = changeArr(arr, 5, 30);

export default () => (
  <div>
    原始数组：
    <pre>{JSON.stringify(arr)}</pre>
    修改后的数组：
    <pre>{JSON.stringify(newArr1)}</pre>
    <pre>{JSON.stringify(newArr2)}</pre>
  </div>
);
```

## removeArrIndex 根据下标删除数组的内容

```ts
/**
 * 该操作和 arr[index] = newItem; 的效果类似
 * @param arr 数组本身
 * @param index 数组下标，可选多个
 */
function removeArrIndex<T>(arr: T[], ...index: number[]): T[];
```

```tsx
import React from 'react';
import { removeArrIndex } from '@orca-fe/tools';

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const newArr1 = removeArrIndex(arr, 1, 3, 5, 7);

export default () => (
  <div>
    原始数组：
    <pre>{JSON.stringify(arr)}</pre>
    修改后的数组：
    <pre>{JSON.stringify(newArr1)}</pre>
  </div>
);
```

## toggleArr 切换数组的内容

```ts
/**
 * 如果数组中已经包含了该内容，则删除，否则增加
 * @param arr 数组本身
 * @param item 需要切换的内容
 * @param compare 如果数组中存放的是引用类型，则需要通过回调函数具体判断是否相同。
 */
function toggleArr<T>(arr: T[], item: T, compare = (a: T, b: T) => a == b): T[];
```

```tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { toggleArr } from '@orca-fe/tools';

export default () => {
  const [array, setArray] = useState(['a', 'b', 'c']);

  return (
    <div>
      数组：
      <pre>{JSON.stringify(array)}</pre>
      <Button onClick={() => setArray(toggleArr(array, 'b'))}>Toggle</Button>
    </div>
  );
};
```
