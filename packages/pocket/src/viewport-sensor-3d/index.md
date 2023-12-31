---
title: ViewportSensor3d 视图管理工具3d

group:
  title: 基础组件
  path: /base
---

# ViewportSensor3d 视图管理工具3d

该工具还处于开发阶段，暂时不要使用。

```tsx
import React from 'react';
import { ViewportSensor3d } from '@orca-fe/pocket';
import { Viewport3dContext } from './context';

export default () => {
  return (
    <ViewportSensor3d style={{ height: 300, border: '1px solid #DDD', position: 'relative' }}>
      <Viewport3dContext.Consumer>
        {({ viewport }) => {
          const vp = new ViewportSensor3d.Viewport3d(viewport);
          let p100 = vp.project([100, 100]);
          return (
            <>
              <div
                style={{
                  transformOrigin: 'top left',
                  transform: `translate(${viewport.left}px, ${viewport.top}px) scale(${2 ** viewport.zoom}) rotate(${viewport.rotate}deg)`,
                  userSelect: 'none',
                  border: '1px solid #DDD',
                  height: 100,
                }}
              >
                <div>left：{viewport.left}</div>
                <div>top：{viewport.top}</div>
                <div>zoom：{viewport.zoom}</div>
                <div>rotate：{viewport.rotate}</div>
              </div>
              <div style={{ position: 'absolute', left: p100[0], top: p100[1], border: '2px solid #f00' }}></div>
            </>
          );
        }}
      </Viewport3dContext.Consumer>
    </ViewportSensor3d>
  );
};
```

## API

| 属性   | 说明         | 类型               | 默认值 |
| ------ | ------------ | ------------------ | ------ |
| center | 中心点偏移量 | `[number, number]` | `-`    |
