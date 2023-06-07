---
title: BorderSliceImg 图片边框组件

group:
  title: 基础组件
  path: /base
---

# BorderSliceImg 图片边框组件

`@orca-fe/pocket@1.17.0`

利用 `border-slice` 的特性，使边框类型的图片能够更好地自适应大小。

你需要设置 `sliceTop` / `sliceRight` / `sliceBottom` / `sliceLeft` 四个参数，来确定上下左右不被拉伸的区域。
中间部分仅保留纯色或规则的渐变。

## 示例

### 基础用法

```tsx
import React, { useState } from 'react';
import { BorderSliceImg } from '@orca-fe/pocket';
import { Slider } from 'antd';

const imgSrc = 'http://d-eye-test.oss-cn-guangzhou.aliyuncs.com/upload/e112805d4c6f48dc8177551562d130cc.png';

export default () => {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(500);

  return (
    <div style={{ backgroundColor: '#202020', color: '#ffffff', padding: '16px' }}>
      <p>这是一张示例图片</p>
      <p>
        <img src={imgSrc} style={{ width: '100%', maxWidth: 1440 }} />
      </p>
      <p>下面是设置了边框边界后的效果</p>
      width:
      <Slider value={width} min={100} max={2000} onChange={setWidth} />
      height:
      <Slider value={height} min={100} max={1500} onChange={setHeight} />
      <BorderSliceImg
        src={imgSrc}
        sliceTop={100}
        sliceRight={30}
        sliceBottom={30}
        sliceLeft={475}
        scale={0.5}
        style={{
          width,
          height,
        }}
      />
    </div>
  );
};
```

### 调整边框宽度

你可以调整下方滚动条，以查看不同参属下的边框效果

```tsx
import React, { useState } from 'react';
import { BorderSliceImg } from '@orca-fe/pocket';
import { Slider } from 'antd';

const imgSrc = 'http://d-eye-test.oss-cn-guangzhou.aliyuncs.com/upload/e112805d4c6f48dc8177551562d130cc.png';

export default () => {
  const [sliceTop, setSliceTop] = useState(100);
  const [sliceRight, setSliceRight] = useState(30);
  const [sliceBottom, setSliceBottom] = useState(30);
  const [sliceLeft, setSliceLeft] = useState(475);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);

  return (
    <div style={{ backgroundColor: '#202020', color: '#ffffff', padding: '16px' }}>
      sliceTop:
      <Slider value={sliceTop} min={0} max={500} onChange={setSliceTop} />
      sliceRight:
      <Slider value={sliceRight} min={0} max={500} onChange={setSliceRight} />
      sliceBottom:
      <Slider value={sliceBottom} min={0} max={500} onChange={setSliceBottom} />
      sliceLeft:
      <Slider value={sliceLeft} min={0} max={500} onChange={setSliceLeft} />
      width:
      <Slider value={width} min={100} max={2000} onChange={setWidth} />
      height:
      <Slider value={height} min={100} max={1500} onChange={setHeight} />
      <BorderSliceImg
        src={imgSrc}
        sliceTop={sliceTop}
        sliceRight={sliceRight}
        sliceBottom={sliceBottom}
        sliceLeft={sliceLeft}
        scale={0.5}
        style={{
          width,
          height,
        }}
      />
    </div>
  );
};
```

## API

| 属性        | 说明                       | 类型      | 默认值 |
| ----------- | -------------------------- | --------- | ------ |
| src         | 图片地址                   | `string`  | `-`    |
| sliceTop    | 图片顶部需要作为边框的距离 | `number`  | `-`    |
| sliceLeft   | 图片左侧需要作为边框的距离 | `number`  | `-`    |
| sliceRight  | 图片右侧需要作为边框的距离 | `number`  | `-`    |
| sliceBottom | 图片底部需要作为边框的距离 | `number`  | `-`    |
| fill        | 是否填充中间部分           | `boolean` | `true` |
| scale       | 缩放图片                   | `number`  | `1`    |
