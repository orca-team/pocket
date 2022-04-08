---
title: LoadScript 动态加载脚本
nav:
  title: Pocket 组件
  path: /component
group:
  title: 基础组件
  path: /base
---

# LoadScript 动态加载脚本

本工具允许你动态在项目中引入 script 脚本。

> 你不必担心重复引用，LoadScript 会判断脚本路径，如果已加载则不再重新引入。

## 使用示例

```typescript jsx
import { loadScript, ReactScript } from '@orca-fe/pocket';

// 使用方式1：直接调用 loadScript 加载脚本
loadScript('http://server-ip/test.js')
  .then(() => {
    console.log('load success');
  })
  .catch(() => {
    console.log('load failed');
  });

// 使用方式2：React组件
export default () => {
  const handleScriptLoaded = () => {
    console.log('loaded');
  };

  return (
    <div>
      <ReactScript src="http://server-ip/test.js" onLoad={handleScriptLoaded} />
    </div>
  );
};
```

## ReactScript Props

| 属性    | 说明                                 | 类型                    | 默认值 |
| ------- | ------------------------------------ | ----------------------- | ------ |
| src     | 需要加载的 script 地址，支持传入多个 | `string` / `string[]`   | -      |
| onLoad  | 当 script 加载完成后的回调函数       | `() => void`            | -      |
| onError | 当 script 加载失败后的回调函数       | `(error:Error) => void` | -      |
