/**
 * title: 调试用例
 * description:
 * debug: true
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
      <Button
        onClick={async () => {
          // eslint-disable-next-line no-alert
          const url = window.prompt('insert image url.');
          if (url) {
            setData([
              ...data,
              {
                type: 'image',
                src: url,
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                rotate: 0,
                disabled: true,
              },
            ]);
          }
        }}
      >
        Add Image
      </Button>
      <Painter ref={painterRef} data={data} onDataChange={setData} style={{ height: 400 }} />
    </div>
  );
};

export default Demo1;
