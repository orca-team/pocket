---
nav:
  title: Antd
  order: 1
---

![npm](https://img.shields.io/npm/v/@orca-fe/antd-plus.svg)

# 介绍

这是一个对 `antd` 组件库的扩展。

组件默认针对 `antd@5.x` 进行封装，尽量兼容 `antd@4.x`。

## 安装依赖

您可以使用您熟悉的包管理工具安装该工具库。

```bash
npm i @orca-fe/antd-plus
# or
yarn add @orca-fe/antd-plus
# or ...
```

## 使用

具体使用方式，请查看每一个工具的文档。

```tsx | pure
import React from 'react';
import { Img } from '@orca-fe/antd-plus';

export default () => {
  return <Img src="/tmp.jpg" />;
};
```

### 样式引入

样式已全部使用 `jss` 的方式引入，不再需要额外引入
