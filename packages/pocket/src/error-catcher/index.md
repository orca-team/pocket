---
title: ErrorCatcher 异常容器

group:
  title: 基础组件
  path: /base
---

# ErrorCatcher 异常容器

`componentDidCatch`的简易封装，当组件在渲染阶段报错时，能够及时拦截异常，防止整页白屏

## 示例

### 基础用法

<code src="./demo/Demo1.tsx" ></code>

### errorTips 回调函数

<code src="./demo/Demo2.tsx" ></code>

## API

| 属性      | 说明                                  | 类型                                                                                                     | 默认值 |
| --------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------ |
| errorTips | 错误提示信息                          | `React.ReactNode` / `(error: Error, errorInfo: React.ErrorInfo, reset: (() => void)) => React.ReactNode` | ''     |
| onError   | 报错事件，参数来自`componentDidCatch` | `(error: Error, errorInfo: React.ErrorInfo) => void`                                                     | -      |
