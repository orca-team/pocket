# 介绍

这是一个对 `antd` 组件库的扩展。

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

如果你需要使用某个组件，你需要引入对应的样式文件，如：

```ts | pure
import { EqRatioBox } from '@orca-fe/pocket';
import '@orca-fe/pocket/lib/eq-ratio-box/style';
```

组件库的样式引入，和 `antd` 的按需引入类似。`css`/`全量引入`的方式暂未支持，后续会加上。

所以，你需要和 `antd` 一样使用 `babel-plugin-import` 来自动按需引入样式文件。

**如果你使用 `umi@3.x` 作为项目开发框架，你可以直接使用我们为 `umi` 封装的 `umi-plugin-orca-pocket` 来实现自动配置 `babel-plugin-import`**
