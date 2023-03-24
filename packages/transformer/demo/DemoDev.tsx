/**
 * title: 调试用例
 * description:
 * debug: true
 */

import React, { useState } from 'react';
import type { Bounds } from '@orca-fe/transformer';
import { TransformerLayout } from '@orca-fe/transformer';

type DataType = {
  color?: string;
  bounds: Bounds;
};

const Demo = () => {
  const [data, setData] = useState<DataType[]>([
    {
      color: '#BEA',
      bounds: {
        left: 50,
        top: 30,
        width: 120,
        height: 70,
        rotate: 0,
      },
    },
    {
      color: '#EBA',
      bounds: {
        left: 200,
        top: 50,
        width: 200,
        height: 150,
        rotate: 30,
      },
    },
  ]);

  return (
    <TransformerLayout data={data} onDataChange={setData} style={{ position: 'relative', height: 300, backgroundColor: '#EEE' }}>
      {({ color = '#999' }) => <div style={{ height: '100%', backgroundColor: color }} />}
    </TransformerLayout>
  );
};

export default Demo;
