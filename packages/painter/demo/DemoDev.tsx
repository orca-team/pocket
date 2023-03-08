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
  return (
    <div>
      <Button
        onClick={() => {
          const painter = painterRef.current;
          if (painter) {
            painter.draw('ellipse');
          }
        }}
      >
        Draw Ellipse
      </Button>
      <Button
        onClick={() => {
          const painter = painterRef.current;
          if (painter) {
            painter.draw('line');
          }
        }}
      >
        Draw Line
      </Button>
      <Painter ref={painterRef} />
    </div>
  );
};

export default Demo1;
