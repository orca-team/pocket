---
title: usePan 拖拽平移

group:
  title: hooks
  path: /base
---

# usePan 拖拽平移

`@orca-fe/hooks@0.9.0`

使用鼠标拖拽时，记录拖拽的距离

## 示例

```tsx
import React, { useRef, useState } from 'react';
import { usePan } from '@orca-fe/hooks';

export default () => {
  const [value, setValue] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  usePan((info) => {
    const { offset, finish } = info;
    setValue(`${offset[0]}px, ${offset[1]}px`);
    if (finish) {
      setValue('');
    }
  }, rootRef);
  return (
    <div ref={rootRef} style={{ height: 400, backgroundColor: '#ccf' }}>
      请用鼠标拖拽我 {value}
    </div>
  );
};
```

## API

`usePan(callback: (info: UsePanCallbackParams) => void, target: Target)`

| 属性   | 说明       | 类型                                          | 默认值 |
| ------ | ---------- | --------------------------------------------- | ------ |
| target | 拖拽的目标 | 同 `ahooks` 的 `useEventListener` 的 `target` | -      |

### UsePanCallbackParams

```ts | pure
type PositionType = [number, number];

type UsePanCallbackParams = {
  /** 拖动事件的起始位置 */
  startPosition: PositionType;
  /** 拖动事件的偏移量 */
  offset: PositionType;
  /** 是否结束（鼠标抬起） */
  finish: boolean;
  /** 是否开始（鼠标按下） */
  start: boolean;
  /** 触发拖动事件的鼠标事件 */
  ev: MouseEvent;
  /** 触发拖动事件的 HTML 元素 */
  target: HTMLElement;
};
```

| 属性   | 说明                                                 | 类型                 |
| ------ | ---------------------------------------------------- | -------------------- |
| offset | 拖拽的距离(x,y)                                      | [`number`, `number`] |
| finish | 是否拖拽结束                                         | `boolean`            |
| start  | 是否拖拽开始                                         | `boolean`            |
| ev     | 鼠标拖拽的事件（可能是 mousedown/mousemove/mouseup） | `MouseEvent`         |
