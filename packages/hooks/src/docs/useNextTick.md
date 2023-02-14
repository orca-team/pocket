---
title: useNextTick 下一帧
nav:
  title: Hooks
  path: /hooks
group:
  title: hooks
  path: /base
---

# useNextTick 下一帧

`@orca-fe/hooks@0.9.0`

在 `vue` 中，如果需要在状态变化导致组件渲染完成之后立即做些什么，我们可以使用 `nextTick`。

在 `React` class 组件中，也可以通过 `setState` 的第二个参数的回调函数，达到类似效果。

而在函数组件中，我们需要通过 `useEffect` 监听变化的状态来实现，但是这对于某些业务逻辑来说，是比较割裂的。

使用 `useNextTick` 来在`React 事件`中，获得类似 `nextTick` 的效果（当然，使用 `nextTick` 前需要进行状态更新）。

## 示例

```tsx
import React, { useState, useRef } from 'react';
import { useNextTick } from '@orca-fe/hooks';
import { Button } from 'antd';

export default () => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(1);

  const nextTick = useNextTick();

  const handleClick = () => {
    setCount(count + 1);

    console.log('div 的值为 ', rootRef.current.innerText);
    nextTick(() => {
      console.log('nextTick: div 的值为 ', rootRef.current.innerText);
    });
  };

  return (
    <div>
      <div>请打开控制台，并点击 +1 按钮查看结果</div>
      <div ref={rootRef}>count: {count}</div>
      <Button onClick={handleClick}>+1</Button>
    </div>
  );
};
```

## useLayoutNextTick

`@orca-fe/hooks@0.11.0`

和 `useNextTick` 的使用方法完全一致，只是内部的 `useEffect` 替換成 `useLayoutEffect`。

## API

`useNextTick(): (callback: () => void) => void`
