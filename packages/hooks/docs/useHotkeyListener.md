---
title: useHotkeyListener 热键管理器

group:
  title: hooks
  path: /base
---

# useHotkeyListener 热键管理器

便捷的快捷键监听工具。具备快捷键预设、热键修改、热键优先级配置等能力。

## 特性

### 按键预设监听

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

### 支持直接热键监听

推荐在代码中使用按键预设来监听快捷键，但你也可以直接使用热键进行监听，请查看下面的写法：

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

### 支持优先级

监听事件时，允许设置监听优先级 `priority`（默认为 0），数值较大的则更早被触发。详情可查看后面的示例。

### 支持事件拦截

默认情况下，事件通过优先级和监听顺序依次传递。你可通过配置 `through` 参数为 `false`，或者在事件回调中返回 `false`，来中断事件的传递。

这样，当一个事件被响应后，后面的事件就不会再被触发了。

### 支持临时禁用

当你的组件处于隐藏状态，而不需要监听快捷键时，可以通过设置 `disabled` 来临时禁用本条热键监听。详情可查看后面的示例。

## 示例

```tsx
/**
 * title: 基础用法
 * description: 本示例中，监听了 Delete 快捷键（Mac下也可通过 Backspace）触发， Ctrl+X，Ctrl+Shift+C。你可以按下这些快捷键并查看提示
 */
import React from 'react';
import { useHotkeyListener } from '@orca-fe/hooks';
import { message } from 'antd';

export default () => {
  useHotkeyListener('delete', () => {
    message.info('Demo1: delete');
  });
  useHotkeyListener('Ctrl+X', () => {
    message.info('Demo1: Ctrl+X');
  });
  useHotkeyListener('Ctrl+Shift+C', () => {
    message.info('Demo1: Ctrl+Shift+C');
  });
  return <div>按 Delete / Ctrl+X / Ctrl+Shift+C 查看效果</div>;
};
```

```tsx
/**
 * title: 触发优先级
 * description: 本示例中监听了 2 次 copy 事件，你可以修改 copy2 的触发优先级（比如分别设置为 1 和 -1），然后按下 copy 查看 message 触发的顺序
 */
import React, { useState } from 'react';
import { useHotkeyListener } from '@orca-fe/hooks';
import { InputNumber, message } from 'antd';

export default () => {
  const [priority, setPriority] = useState(1);
  useHotkeyListener('copy', () => {
    message.info('Demo2: copy1');
  });
  useHotkeyListener(
    'copy',
    () => {
      message.info('Demo2: copy2');
    },
    { priority },
  );
  return (
    <div>
      <div>
        priority: <InputNumber value={priority} onChange={setPriority} />
      </div>
      修改优先级并用快捷键复制，查看效果。
    </div>
  );
};
```

```tsx
/**
 * title: 事件拦截
 * description: 当我们有多个组件监听了相同快捷键时（比如在弹窗内），通常我们只希望触发一个事件，这就可以用到事件拦截
 */
import React, { useState } from 'react';
import { useHotkeyListener } from '@orca-fe/hooks';
import { Button, InputNumber, message, Modal, Space } from 'antd';

const MyModal = (props) => {
  const { open, onOk } = props;

  const confirmModal = () => {
    message.info('Demo3: 确认弹窗内容');
    onOk();
  };

  useHotkeyListener('confirm', confirmModal, {
    disabled: !open,
    through: false,
    priority: 1,
  });

  return (
    <Modal title="标题" {...props} onOk={confirmModal}>
      <p>这里表单的具体内容我就不写了，你可以按下 Ctrl+Enter / Command+Enter 来确认并关闭弹窗。</p>
      <p>
        注意：弹窗内的快捷键监听，设置了 disabled 属性，防止在弹窗未显示的情况下也会响应事件；设置了 through:
        false，可以保证弹框响应事件后，不再让事件传递到其它地方；设置了 priority: 1 是为了确保弹框内的事件触发优先级更高。
      </p>
    </Modal>
  );
};

export default () => {
  const [open, setOpen] = useState(false);

  const confirm = () => {
    message.success('Demo3: 开始提交内容');
  };
  useHotkeyListener('confirm', confirm);
  return (
    <div>
      <div>
        <Space>
          <Button onClick={() => setOpen(true)}>打开弹窗</Button>
          <Button type="primary" onClick={confirm}>
            提交
          </Button>
        </Space>
        <MyModal
          open={open}
          onOk={() => {
            setOpen(false);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </div>
      本页面和弹窗中都会监听 Ctrl+Enter / Command+Enter，但开启弹窗后，只有弹窗的事件被响应
    </div>
  );
};
```
