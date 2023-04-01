---
nav:
  title: Hooks
  order: 1
---

![npm](https://img.shields.io/npm/v/@orca-fe/hooks.svg)

# 介绍

这是在当前 `React` 项目的研发过程中，沉淀的一套通用 `hooks` 库。

## 安装依赖

您可以使用您熟悉的包管理工具安装该工具库。

```bash
npm i @orca-fe/hooks
# or
yarn add @orca-fe/hooks
# or ...
```

## 使用

具体使用方式，请查看每一个工具的文档。

```tsx | pure
import React from 'react';
import { useAnimationFrame } from '@orca-fe/hooks';

export default () => {
  useAnimationFrame(() => {
    // 在此编写代码
  });
  return <div>...</div>;
};
```
