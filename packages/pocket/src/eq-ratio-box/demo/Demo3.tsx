/**
 * title: Cover mode（disable scaleMode）
 * desc: disable scaleMode
 *
 * title.zh-CN: Cover 模式（禁用scaleMode）
 * desc.zh-CN: 这个例子，参数和上一个一样，但禁用了 `scaleMode` 因此只有容器尺寸发生变化，但内容不会被缩放
 */
import React from 'react';
import { EqRatioBox } from '@orca-fe/pocket';
import Ruler from './Ruler';

const Demo = () => (
  <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
    {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((width) => (
      <EqRatioBox
        key={width}
        width={150}
        height={150}
        mode="cover"
        scaleMode={false}
        style={{
          border: '1px solid #9999FF',
          overflow: 'hidden',
          height: 60,
          width,
        }}
      >
        <Ruler />
      </EqRatioBox>
    ))}
  </div>
);

export default Demo;
