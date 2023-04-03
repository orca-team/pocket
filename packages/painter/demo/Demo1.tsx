/**
 * title: 基础用法
 * description:
 */

import React, { useState } from 'react';
import type { ShapeDataType } from '@orca-fe/painter';
import Painter, { usePainterRef } from '@orca-fe/painter';
import { Button } from 'antd';

const Demo1 = () => {
  const painterRef = usePainterRef();
  const draw = (shapeType) => {
    const painter = painterRef.current;
    if (painter) {
      painter.draw(shapeType);
    }
  };

  const [data, setData] = useState<ShapeDataType[]>([]);

  return (
    <div>
      <Button
        onClick={() => {
          draw('line');
        }}
      >
        Draw Line
      </Button>
      <Button
        onClick={() => {
          draw('line-path');
        }}
      >
        Draw LinePath
      </Button>
      <Button
        onClick={() => {
          draw('ellipse');
        }}
      >
        Draw Ellipse
      </Button>
      <Button
        onClick={() => {
          draw('rectangle');
        }}
      >
        Draw Rectangle
      </Button>
      <Painter ref={painterRef} data={data} onDataChange={setData} style={{ height: 400 }} />
    </div>
  );
};

export default Demo1;
