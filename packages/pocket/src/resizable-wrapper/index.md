---
title: ResizeWrapper 容器大小调整

group:
  title: 基础组件
  path: /base
---

# ResizeWrapper Flex 布局容器大小调整

`resize-wrapper` 支持在弹性布局中，添加一个可调整大小的边框，并允许使用者调整该内容的大小。

当然，考虑到 `flex 布局` 的特性，`resize-wrapper` 只支持单个边框的尺寸调整。

## 示例

### 基础用法

```tsx
import React from 'react';
import { ResizableWrapper } from '@orca-fe/pocket';

export default () => (
  <div
    style={{
      height: 200,
      display: 'flex',
      border: '1px solid #CCCCCC',
      overflow: 'hidden',
    }}
  >
    <ResizableWrapper minWidth={100} defaultWidth={150} horizontal horizontalPosition="right" style={{ backgroundColor: '#CFC' }}>
      你可以拖拽右侧调整容器大小
    </ResizableWrapper>
    <div style={{ flex: 1, height: '100%', backgroundColor: '#CCF' }}>center</div>
    <ResizableWrapper minWidth={100} defaultWidth={100} horizontal horizontalPosition="left" style={{ backgroundColor: '#FCC' }}>
      你可以拖拽左侧调整容器大小
    </ResizableWrapper>
  </div>
);
```

### 受控模式

这里实现了类似 VSCode 的左侧面板展开收起

```tsx
import React, { useState } from 'react';
import { ResizableWrapper } from '@orca-fe/pocket';

export default () => {
  const [width, setWidth] = useState(300);
  return (
    <div
      style={{
        height: 200,
        display: 'flex',
        border: '1px solid #CCCCCC',
        overflow: 'hidden',
      }}
    >
      <ResizableWrapper
        width={width}
        onWidthChange={(newWidth) => {
          let respectWidth = newWidth;
          if (respectWidth < 150) {
            // 收起宽度 50
            respectWidth = 50;
          } else if (respectWidth < 230) {
            // 最小展开宽度 230
            respectWidth = 230;
          }
          if (width !== respectWidth) {
            setWidth(respectWidth);
          }
        }}
        horizontal
        horizontalPosition="right"
        style={{ backgroundColor: '#CFC' }}
      >
        {width > 50 ? '展开的左侧面板' : '收起'}
      </ResizableWrapper>
      <div style={{ flex: 1, height: '100%', backgroundColor: '#CCF' }}>center</div>
    </div>
  );
};
```

## API

| 属性               | 说明                     | 类型                       | 默认值     |
| ------------------ | ------------------------ | -------------------------- | ---------- |
| vertical           | 是否支持垂直调整(height) | `boolean`                  | `false`    |
| horizontal         | 是否支持水平调整(width)  | `boolean`                  | `false`    |
| defaultWidth       | 默认宽度                 | `number`                   | -          |
| defaultHeight      | 默认高度                 | `number`                   | -          |
| width              | 宽度（受控模式）         | `number`                   | -          |
| height             | 高度（受控模式）         | `number`                   | -          |
| minWidth           | 最小宽度                 | `number`                   | -          |
| maxWidth           | 最大宽度                 | `number`                   | -          |
| minHeight          | 最小高度                 | `number`                   | -          |
| maxHeight          | 最大高度                 | `number`                   | -          |
| onWidthChange      | 宽度变化的回调事件       | `(width: number) => void`  | -          |
| onHeightChange     | 高度变化的回调事件       | `(height: number) => void` | -          |
| verticalPosition   | 顶部/底部调整            | `'top'` / `'bottom'`       | `'bottom'` |
| horizontalPosition | 左侧/右侧调整            | `'left'` / `'right'`       | `'right'`  |
| triggerOnResize    | 当容器尺寸变化时触发事件 | `boolean`                  | `true`     |
