---
title: useMergedRefs 合并 ref
nav:
  title: Hooks
  path: /hooks
group:
  title: hooks
  path: /base
---

# useMergedRefs 合并 ref

这个 hook 用于合并多个 `Ref` 到一个。在进行 `forwardRef` 组件封装的时候比较常用。

比如说，我们封装了一个组件，root 节点为 `div`。我们需要将 `div` 的 `ref` 暴露出去，于是我们可以这样写。

```tsx | pure
import React, { forwardRef } from 'react';

export default forwardRef<HTMLDivElement, Props>((props, ref) => {
  return <div ref={ref}>......</div>;
});
```

这个时候，我们需要在组件内部使用 `ref`，比如使用 `useEventListener` 监听事件，或者直接取得或修改 `DOM`
上的一些属性。你是不是会直接取用这个 `ref` 变量呢？

但要注意的是，这里的 `ref` 是由外部使用者传入的，我们不知道使用者是传入了一个函数，或者一个 `Ref` 对象，或者他根本没有传入
ref，那么 `ref` 的值就是 undefined。

所以你可能想要在内部自己定义一个 `RefObject`，比如：

```ts
import { useRef } from 'react';

const rootRef = useRef<HTMLDivElement>();
```

但是 `<div></div>` 只能接收一个 `ref` 属性啊。

所以我们可以写成这样。

```tsx
import React, { forwardRef, useEffect } from 'react';
import { useMergedRefs } from '@orca-fe/hooks';

export default forwardRef<HTMLDivElement, Props>((props, ref) => {
  const rootRef = useRef<HTMLDivElement>();
  const mergedRefs = useMergedRefs(rootRef, ref);

  useEffect(() => {
    // 我们在声明周期中可以使用 rootRef，同时不影响外部的 ref
    console.log(rootRef.current.innertText);
  }, []);

  return <div ref={mergedRefs}>......</div>;
});
```
