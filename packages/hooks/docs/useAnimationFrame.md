---
title: useAnimationFrame
nav:
  title: Hooks
  path: /hooks
group:
  title: hooks
  path: /base
---

# useAnimationFrame

在函数组件中，基于[`requestAnimationFrame`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)
得到一个持续的回调事件。

每次调用`requestAnimationFrame`并触发回调时，你可以得到当前经过的时间及距离上一帧间隔的时间

## 示例

```tsx
import React from 'react';
import { useAnimationFrame } from '@orca-fe/hooks';
import { Button } from 'antd';

export default () => {
  const rafHandle = useAnimationFrame(
    (time, frameTime) => {
      // do something
      // time 持续时间
      // frameTime 距离上一帧的时间
      console.log(time, frameTime);
    },
    { manual: true },
  );
  return (
    <div>
      <Button onClick={rafHandle.toggle}>启动/停止计时器</Button> 请打开控制台查看日志
    </div>
  );
};
```

## API

```ts | pure
const rafHandle = useAnimationFrame((time, frameTime) => {}, { manual: true });
```

### 选项

| 属性   | 说明     | 类型      | 默认值  | 版本    |
| ------ | -------- | --------- | ------- | ------- |
| manual | 手动启动 | `boolean` | `false` | `1.8.0` |

### 回调参数

| 属性      | 说明               | 类型     | 默认值 |
| --------- | ------------------ | -------- | ------ |
| time      | 持续时间           | `number` | -      |
| frameTime | 距离上一帧执行时间 | `number` | -      |

### rafHandle

`1.8.0`

| 属性    | 说明         | 类型       |
| ------- | ------------ | ---------- |
| running | 是否正在运行 | `boolean`  |
| start   | 启动计时器   | `Function` |
| stop    | 停止计时器   | `Function` |
