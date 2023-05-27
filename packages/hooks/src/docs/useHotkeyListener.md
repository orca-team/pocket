---
title: useHotkeyListener 热键管理器
nav:
  title: Hooks
  path: /hooks
group:
  title: hooks
  path: /base
---

# useHotkeyListener 热键管理器

## 特性

### 按键预设

允许将常用的快捷键设置为按键预设，以此来避免直接在代码中写死快捷键，同时也便于实现快捷键的映射。

按键预设的修改及书写格式可参考以下示例：

```ts | pure
import { useHotkeyListener } from '@orca-fe/hooks';

// 设置快捷键预设
useHotkeyListener.updateHotkeyDefs({
  // copy 是预设名称，按键映射需要传入一个数组
  // 数组长度为 2 时，表示 Mac 环境下使用不同的快捷键映射
  copy: ['Ctrl+C', 'Command+C'],
  paste: ['Ctrl+V', 'Command+V'],
  cut: ['Ctrl+X', 'Command+X'],
  undo: ['Ctrl+Z', 'Command+Z'],
  save: ['Ctrl+S', 'Command+S'],
  redo: [
    // 当使用二维数组作为映射时，表示该预设支持多种快捷键触发
    // 比如这里的 redo 命令，支持 Ctrl+Shift+Z 或 Ctrl+Y 触发
    ['Ctrl+Shift+Z', 'Ctrl+Y'],
    // Mac 下则是这由两条快捷键触发
    ['Command+Shift+Z', 'Command+Y'],
  ],
  confirm: ['Ctrl+Enter', 'Command+Enter'],
  // Windows 环境只触发 Delete， Mac 环境支持 Delete 或 Backspace
  delete: ['Delete', ['Delete', 'Backspace']],
  // 如果只传入 1 个按键映射，表示所有环节都只使用这种快捷键触发
  escape: ['Escape'],
});
```

### 支持临时热键

推荐在代码中使用按键预设来监听快捷键，但你也可以直接使用热键进行监听，请看一下示例：

```tsx | pure
import { useHotkeyListener } from '@orca-fe/hooks';

export default () => {
  // 可以直接使用按键预设监听
  useHotkeyListener('cut', () => {
    console.log('触发了 cut 事件');
  });

  // 也可以直接使用快捷键监听
  useHotkeyListener('Ctrl+D', () => {
    console.log('触发了 Ctrl+D');
  });

  // 支持使用二元组，适配 Windows 和 Mac 快捷键（注：这里不支持按键预设那样传入多个快捷键，如有需要，请编写多个 hooks）
  useHotkeyListener(['Ctrl+O', 'Command+O'], () => {
    console.log('触发了 Ctrl+O/Command+O');
  });

  return <div>...</div>;
};
```

###

## 示例

```tsx
import React from 'react';
import { useHotkeyListener } from '@orca-fe/hooks';
import { message } from 'antd';

export default () => {
  useHotkeyListener('delete', () => {
    message.info('delete');
  });
  useHotkeyListener('Ctrl+X', () => {
    message.info('Ctrl+X');
  });
  useHotkeyListener('Ctrl+Shift+C', () => {
    message.info('Ctrl+Shift+C');
  });
  return <div>Demo</div>;
};
```
