---
title: useStaticClick 静态单击事件
nav:
  title: Hooks
  path: /hooks
group:
  title: hooks
  path: /base
---

# useStaticClick 静态单击事件

`@orca-fe/hooks@0.9.0`

当鼠标按下再抬起，`click` 事件就会触发。尽管在鼠标在按下之后可能发生了位移，但 `click` 事件仍然会触发。

有时，我们只想要响应静态的单击事件（即鼠标没有发生位移），在函数组件中使用 `useStaticClick` 即可。

## 示例

点击蓝色方块，数字+1，如果鼠标按下的过程中拖动了鼠标，则不会+1。

```tsx
import React, { useRef, useState } from 'react';
import { useStaticClick } from '@orca-fe/hooks';

export default () => {
  const [count, setCount] = useState(1);
  const rootRef = useRef<HTMLDivElement>(null);

  useStaticClick(() => {
    setCount(count + 1);
  }, rootRef);
  return (
    <div
      ref={rootRef}
      style={{ height: 200, width: 300, backgroundColor: '#ccf' }}
    >
      Click Me {count}
    </div>
  );
};
```

## API

`useStaticClick(callback: (ev: MouseEvent) => void, options: UseStaticClickOptions)`

### UseStaticClickOptions

```ts | pure
export type UseStaticClickOptions<T extends Target = Target> = {
  target?: T;
  distance?: number;
};
```

| 属性     | 说明                                                 | 类型                                          | 默认值 |
| -------- | ---------------------------------------------------- | --------------------------------------------- | ------ |
| target   | 监听的对象                                           | 同 `ahooks` 的 `useEventListener` 的 `target` | -      |
| distance | 最大触发距离，如果鼠标按下时平移距离超过该值则不触发 | `number`                                      | 2      |
