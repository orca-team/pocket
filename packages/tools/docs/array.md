---
title: Array 数组相关

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

## arr2Keys 数组转 keySet

`v0.1.0+`

遍历数组并提取对象的 key，生成 Set 集合用于查询缓存，比如，用于判断名称是否重复。

```ts
type Arr2KeysCallback<T> = (item: T, index: number, array: T[]) => string | number;

/**
 * 遍历数组，并获取 键值缓存
 * @param arr 数组
 * @param callback 回调函数，用于获取指定键值，默认取 item.key
 */
export function arr2Keys<T>(arr: T[], callback: PickKeyCallback<T> = (item) => item['key']): Set<string | number>;
```

```tsx
/**
 * title: 简单示例
 * desc: 在这个例子中，我们利用 arr2Keys 提取数组中的 key，避免创建重复的 key。请点击 + 号，并在弹出的表单中输入内容体验。
 */
import React, { useMemo } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { useDynamicList } from 'ahooks';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { usePromisifyModal } from '@orca-fe/hooks';
import { arr2Keys } from '@orca-fe/tools';

export default () => {
  const { list, remove, getKey, insert } = useDynamicList([
    { key: 'abc', name: 'ABC' },
    { key: 'a', name: 'A' },
    { key: 'bb', name: 'BB' },
  ]);

  const keys = useMemo(() => arr2Keys(list), [list]);

  const modal = usePromisifyModal();

  return (
    <div>
      {list.map((item, index) => (
        <div
          key={getKey(index)}
          style={{
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          key: {item.key} - value: {item.name}
          {list.length > 1 && (
            <MinusCircleOutlined
              style={{ marginLeft: 8 }}
              onClick={() => {
                remove(index);
              }}
            />
          )}
        </div>
      ))}
      <PlusCircleOutlined
        style={{ marginLeft: 8 }}
        onClick={() => {
          modal.show(
            <Modal title="添加" footer={null}>
              <Form
                labelCol={{ span: 3 }}
                onFinish={(item) => {
                  insert(list.length, item);
                  modal.hide();
                }}
              >
                <Form.Item
                  name="key"
                  label="key"
                  rules={[
                    { required: true },
                    {
                      validator: async (_, value) => {
                        if (keys.has(value)) {
                          throw new Error('key 已存在');
                        }
                        return true;
                      },
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="name" label="name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Form>
            </Modal>,
          );
        }}
      />
      {modal.instance}
    </div>
  );
};
```

## arr2KeyValues 数组转 Map

`v0.1.0+`

遍历数组并提取对象的 key，生成 Map 映射用于查询缓存，比如用于字典翻译。

```ts
/**
 * 遍历数组，并获取 key-value 的映射缓存
 * @param arr 数组
 * @param callback 回调函数，用于获取指定键值，默认取 item.key
 */
export function arr2KeyValues<T>(arr: T[], callback: Arr2KeysCallback<T> = (item) => item['key']): Map<string | number, T>;
```

```tsx
/**
 * title: 简单示例
 * desc: 在这个例子中，我们利用 arr2KeyValues 提取字典数组中的 code，并在渲染列表的时候，进行状态字段的翻译。
 */

import React, { useMemo } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { arr2KeyValues } from '@orca-fe/tools';

const dict = [
  { code: '00A', value: '开启' },
  { code: '00B', value: '关闭' },
  { code: '00X', value: '停用' },
];

const arr = [
  { id: '0', name: '任务1', status: '00A' },
  { id: '1', name: '任务2', status: '00B' },
  { id: '2', name: '任务3', status: '00A' },
  { id: '3', name: '任务4', status: '00X' },
  { id: '4', name: '任务5', status: '00A' },
  { id: '5', name: '任务6', status: '00B' },
  { id: '6', name: '任务7', status: '00A' },
];

export default () => {
  const dictMapping = useMemo(() => arr2KeyValues(dict, (item) => item.code), [dict]);
  const columns: ColumnsType<any> = [
    {
      key: 'id',
      dataIndex: 'id',
      title: 'ID',
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: '任务名称',
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '状态',
      render: (value) => dictMapping.get(value)?.value ?? value,
    },
  ];
  return <Table rowKey="id" columns={columns} dataSource={arr} />;
};
```
