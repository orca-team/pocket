/**
 * title: 调试用例
 * description:
 * debug: true
 */

import React from 'react';
import { TransformerBox } from '@orca-fe/transformer';

const Demo1 = () => (
  <div style={{ position: 'relative', height: 300, backgroundColor: '#EEE' }}>
    <TransformerBox
      checked
      defaultBounds={{
        left: 10,
        top: 20,
        width: 100,
        height: 150,
      }}
    />
  </div>
);

export default Demo1;
