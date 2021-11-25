/**
 * title: Custom Loading
 * desc: Custom loading with prop `loadingSrc`
 *
 * title.zh-CN: 自定义 Loading 效果
 * desc.zh-CN: 设置 `loadingSrc` 属性，在图片加载过程中显示。
 */

import React, { useState } from 'react';
import { Img } from '@orca-fe/pocket';

const imgSrc = '/tmp.jpg';

const Demo = () => {
  const [key, setKey] = useState(-1);
  return (
    <div key={key}>
      <button onClick={() => setKey(-key)}>Reload</button>
      <div>默认Loading样式（支持自定义图片，Demo上没有放图，就不演示了）</div>
      <Img src={imgSrc} style={{ width: 100, height: 100 }} />
      <div>自定义Loading Element</div>
      <Img
        src={imgSrc}
        loadingSrc={
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              justifyItems: 'center',
              height: '100%',
            }}
          >
            Loading...
          </div>
        }
        style={{ width: 100, height: 100 }}
      />
    </div>
  );
};

export default Demo;
