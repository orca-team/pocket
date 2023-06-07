---
nav:
  title: 组件
  order: 0
---

![npm](https://img.shields.io/npm/v/@orca-fe/pocket.svg)

# 介绍

这是一个基于 `react` 的组件库。

## 安装依赖

您可以使用您熟悉的包管理工具安装该工具库。

```bash
npm i @orca-fe/pocket
# or
yarn add @orca-fe/pocket
# or ...
```

## 使用

具体使用方式，请查看每一个工具的文档。

```tsx | pure
import React from 'react';
import { Img } from '@orca-fe/pocket';

export default () => {
  return <Img src="/tmp.jpg" />;
};
```

### 样式引入

样式已全部使用 `jss` 的方式引入，不再需要额外引入

## 3.0 重要更新

移除了所有和 `antd` 相关的组件，并将它们归入 `@orca-fe/antd-plus`。

组件包含了： `Dialog` `DialogForm` `JsonSchemaEditor` `ModalForm` `TabsLayout` `UcInput` `WeeklyCalendar`
