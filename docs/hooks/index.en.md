---
nav:
  title: Hooks
  order: 1
---

![npm](https://img.shields.io/npm/v/@orca-fe/hooks.svg)

# Introduction

This is a set of common `hooks` library that was precipitated during the development of our `React` project.

## Installation

You can install this library using your familiar package management tool.

```bash
npm i @orca-fe/hooks
# or
yarn add @orca-fe/hooks
# or ...
```

## Usage

Please check the documentation of each tool for details.

```tsx | pure
import React from 'react';
import { useAnimationFrame } from '@orca-fe/hooks';

export default () => {
  useAnimationFrame(() => {
    // code here
  });
  return <div>...</div>;
};
```
