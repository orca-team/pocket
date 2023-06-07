---
nav:
  title: Component
  order: 0
---

![npm](https://img.shields.io/npm/v/@orca-fe/pocket.svg)

# Introduction

This is a library of components based on `react`.

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

The styles have all been imported using `jss`, no additional import is required

## 3.0 Updates

Moved all components into `@orca-fe/antd-plus` which depend on `antd`.

Components include: `Dialog` `DialogForm` `JsonSchemaEditor` `ModalForm` `TabsLayout` `UcInput` `WeeklyCalendar`
