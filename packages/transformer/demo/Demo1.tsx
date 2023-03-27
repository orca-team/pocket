/**
 * title: 基础边框的效果展示
 * description:
 */

import React from 'react';
import { TransformerBox } from '@orca-fe/transformer';

const Demo = () => (
  <div style={{ position: 'relative', height: 300, backgroundColor: '#EEE' }}>
    <TransformerBox
      checked
      defaultBounds={{
        left: 50,
        top: 30,
        width: 200,
        height: 150,
      }}
      rotateEnable
    >
      你可以拖拽本边框
    </TransformerBox>
  </div>
);

export default Demo;
