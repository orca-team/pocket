/**
 * title: Cover mode
 * desc: Ruler will always cover parent.
 *
 * title.zh-CN: Cover 模式
 * desc.zh-CN: 这个例子为cover模式，标尺永远占满容器，尺寸为 10x60 20x60 30x60 40x60 50x60 60x60 70x60 80x60 90x60
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
