/**
 * title: TransformLayout
 * description: 使用列表数据完成多个盒子的渲染
 */

import React, { useState } from 'react';
import type { Bounds } from '@orca-fe/transformer';
import { TransformerLayout } from '@orca-fe/transformer';
import { Button } from 'antd';

type DataType = {
  color?: string;
  bounds: Bounds;
};

function rand(_min: number = 0, _max?: number): number {
  let max = _max;
  let min = _min;
  if (max == null) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
    <>
      <Button
        onClick={() => {
          setData([
            ...data,
            {
              color: `rgb(${rand(255)},${rand(255)},${rand(255)})`,
              bounds: {
                left: rand(500),
                top: rand(300),
                width: rand(30, 150),
                height: rand(10, 100),
              },
            },
          ]);
        }}
      >
        Add Box
      </Button>
      <TransformerLayout data={data} onDataChange={setData} rotateEnable style={{ position: 'relative', height: 300, backgroundColor: '#EEE' }}>
        {({ color = '#999' }) => <div style={{ height: '100%', backgroundColor: color }} />}
      </TransformerLayout>
    </>
  );
};

export default Demo;
