---
title: useAutoScroll

group:
  title: hooks
  path: /base
---

# useAutoScroll

`1.8.0`

根据鼠标位置，帮助你实现自动滚动的 Hook

## 示例

```tsx
/**
 * title: 基础用法
 * description: 直接将 ref 传递给 useAutoScroll 即可
 */
import React, { useRef } from 'react';
import { useAutoScroll } from '@orca-fe/hooks';

export default () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useAutoScroll(rootRef);

  return (
    <div>
      这里有一个 250 * 250 的容器，里面有 30 * 30 个 100 * 100 的格子，请按在容器中按下鼠标并拖拽，当鼠标移动到容器边缘时，容器会自动滚动。
      <div
        ref={rootRef}
        style={{
          width: 250,
          height: 250,
          border: '1px solid #AAA',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '100px '.repeat(30),
        }}
      >
        {new Array(30 * 30).fill(0).map((_, index) => {
          return (
            <div key={index} style={{ width: '100px', height: '100px', border: '1px solid #CCC' }}>
              {index}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

```tsx
/**
 * title: 手动触发滚动
 * description: 将 `autoTrigger` 设置为 `false` 时，则不会监听点击事件并自动滚动，但你可以手动操作
 */
import React, { useRef } from 'react';
import { useAutoScroll } from '@orca-fe/hooks';
import { Button } from 'antd';

export default () => {
  const rootRef = useRef<HTMLDivElement>(null);

  const autoScrollHandle = useAutoScroll(rootRef, { autoTrigger: false });

  return (
    <div>
      <Button onClick={autoScrollHandle.toggle}>{autoScrollHandle.running ? '滚动中' : '已停止'}</Button>
      点击按钮，触发滚动，然后移动鼠标看看
      <div
        ref={rootRef}
        style={{
          width: 250,
          height: 250,
          border: '1px solid #AAA',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '100px '.repeat(30),
        }}
      >
        {new Array(30 * 30).fill(0).map((_, index) => {
          return (
            <div key={index} style={{ width: '100px', height: '100px', border: '1px solid #CCC' }}>
              {index}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

## API

```ts | pure
function useAutoScroll(target: BasicTarget, options: UseAutoScrollOptions): AutoScrollHandle;
```

### UseAutoScrollOptions

| 属性           | 说明                                    | 类型      | 默认值  | 版本 |
| -------------- | --------------------------------------- | --------- | ------- | ---- |
| edgeSize       | 触发滚动的边缘区域大小                  | `number`  | `100`   | `-`  |
| realtimeBounds | 实时获取容器 bounds，`false` 以节约性能 | `boolean` | `false` | `-`  |
| autoTrigger    | 监听点击事件并自动触发滚动              | `boolean` | `true`  | `-`  |
| scrollableX    | 是否支持横向滚动                        | `boolean` | `true`  | `-`  |
| scrollableY    | 是否支持纵向滚动                        | `boolean` | `true`  | `-`  |

### BasicTarget

需要滚动的对象，可以是 `RefObject` 或 `Element`

### AutoScrollHandle

当 `autoTrigger` 设置为 `false` 时，可以手动触发滚动，详见上方案例。
