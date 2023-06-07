---
title: shouldUpdate 是否重新渲染

group:
  title: 高阶组件
  path: /hoc
---

# shouldUpdate 是否重新渲染

为你的函数组件添加`shouldComponentUpdate`的能力

## 示例

### 基础用法

<code src="./demo/Demo1.tsx" ></code>

## API

export default `shouldUpdate(MyComponent, shouldComponentUpdateFn)`;

| 属性                    | 说明             | 类型                                               | 默认值 |
| ----------------------- | ---------------- | -------------------------------------------------- | ------ |
| component               | 函数组件本身     | `React.ComponentClass` / `React.FunctionComponent` | -      |
| shouldComponentUpdateFn | 渲染前的回调函数 | `(props, prevProps) => boolean`                    | -      |
