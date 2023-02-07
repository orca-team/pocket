/**
 * title: Default usage
 * desc: Simple demo, set xAlign of 'left' / 'center' / 'right'
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN: 下面的例子，设置高度为100。分别展示居左，居中，居右。
 */
import React from 'react';
import { EqRatioBox } from '@orca-fe/pocket';
import Ruler from './Ruler';

const Demo = () => (
  <div>
    <EqRatioBox
      width={150}
      height={150}
      xAlign="left"
      style={{ overflow: 'hidden', height: 100, border: '1px solid #9999ff' }}
    >
      <Ruler />
    </EqRatioBox>
    <p>xAlign = left</p>
    <EqRatioBox
      width={150}
      height={150}
      style={{ overflow: 'hidden', height: 100, border: '1px solid #9999ff' }}
    >
      <Ruler />
    </EqRatioBox>
    <p style={{ textAlign: 'center' }}>xAlign = center(default)</p>
    <EqRatioBox
      width={150}
      height={150}
      xAlign="right"
      style={{ overflow: 'hidden', height: 100, border: '1px solid #9999ff' }}
    >
      <Ruler />
    </EqRatioBox>
    <p style={{ textAlign: 'right' }}>xAlign = right</p>
  </div>
);

export default Demo;
