---
nav:
  title: Component
  order: 0
---

![npm](https://img.shields.io/npm/v/@orca-fe/pocket.svg)

# Introduction

This is an extend-lib to the `antd` component library.

## Installation

You can install this library using your familiar package management tool.

```bash
npm i @orca-fe/pocket
# or
yarn add @orca-fe/pocket
# or ...
```

## Usage

Please check the documentation of each tool for details.

```tsx | pure
import React from 'react';
import { Img } from '@orca-fe/pocket';

export default () => {
  return <Img src="/tmp.jpg" />;
};
```

### Styles

You need to import the style file if you want to use a component, such as:

```ts | pure
import { EqRatioBox } from '@orca-fe/pocket';
import '@orca-fe/pocket/lib/eq-ratio-box/style';
```

The behavior of style import is similar to `antd`. `css` and `full style import` is not supported yet, and will be added later.

So, you need to use `babel-plugin-import` like `antd` to automatically import style files on demand.

**If you work base on `umi@3.x`, you can directly use the `umi-plugin-orca-pocket` to automatically configure `babel-plugin-import`**
