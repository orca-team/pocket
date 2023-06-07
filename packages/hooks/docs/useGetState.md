---
title: useGetState 获取状态

group:
  title: hooks
  path: /base
---

# useGetState 获取状态

`1.1.0`

`const [state, setState, getState] = useGetState(initialState)`

该 `hook` 和 `useState` 具有一样的功能，但额外增加了一个 `getState`。

你可以通过 `getState` 立即获取到当前已经设置的状态。当你执行 `setState` 后，需要立即在另一个函数（无法通过状态变化触发的）中获取该状态的值，就可以使用 `getState` API。

> 不建议将其用在可以通过状态触发的声明周期中，如 useEffect 中。

## 使用场景

```tsx
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { useGetState } from '@orca-fe/hooks';
import { useMemoizedFn } from 'ahooks';
import { Button } from 'antd';

export type CompRef = {
  getCount1: () => number;
  getCount2: () => number;
};

export type CompPropsType = {
  onInit: () => void;
};

// 本组件需要通过一些复杂的逻辑进行初始化，得到一个最新的状态，该状态用于组件渲染，同时外部也需要获取该状态。
const Comp = React.forwardRef<CompRef, CompPropsType>((props, ref) => {
  const { onInit } = props;
  // 这个 count 用于模拟一个复杂状态
  const [count, setCount, getCount] = useGetState(0);

  // 这个 getCount1 是使用传统方式，获取状态的值
  const getCount1 = useMemoizedFn(() => count);

  useImperativeHandle(ref, () => ({ getCount1, getCount2: getCount }));

  useEffect(() => {
    // 初始化时，通过接口获取状态
    const newCount = Math.trunc(Math.random() * 100) + 1;
    // 更新值
    setCount(newCount);
    // 触发初始化完成事件
    onInit();
  }, []);

  return <div>{count}</div>;
});

export default () => {
  const ref = useRef();

  return (
    <>
      <div>本案例分别在组件中通过 普通函数直接获取 (getCount1) 和 getState (getCount2) 获取，请打开控制台查看 getCount1 和 getCount2 的差别</div>
      <div>当前组件的值为：</div>
      <Comp
        ref={ref}
        onInit={() => {
          console.log('getCount1():', ref.current.getCount1());
          console.log('getCount2():', ref.current.getCount2());
        }}
      ></Comp>

      <Button
        onClick={() => {
          console.log('getCount1():', ref.current.getCount1());
          console.log('getCount2():', ref.current.getCount2());
        }}
      >
        GetState Again
      </Button>
    </>
  );
};
```
