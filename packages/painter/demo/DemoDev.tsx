/**
 * title: 调试用例
 * description:
 * debug: true
 */

import React from 'react';
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
      <Painter ref={painterRef} />
    </div>
  );
};

export default Demo1;
