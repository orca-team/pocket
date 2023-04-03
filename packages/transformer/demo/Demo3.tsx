/**
 * title: TransformerLine
 * description: 调整折线
 */

import React, { useState } from 'react';
import type { Point } from '@orca-fe/transformer';
import { TransformerLine } from '@orca-fe/transformer';

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
  const [data, setData] = useState<Point[]>(() => {
    const result: Point[] = [];
    for (let i = 0; i < 5; i += 1) {
      result.push({
        x: rand(500),
        y: rand(300),
      });
    }
    return result;
  });

  return (
    <div style={{ position: 'relative', height: 500 }}>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
      >
        <path
          stroke="#f00"
          fill="none"
          d={data.reduce((acc, cur, index) => {
            if (index === 0) {
              return `M${cur.x},${cur.y}`;
            }
            return `${acc}L${cur.x},${cur.y}`;
          }, '')}
        />
      </svg>
      <TransformerLine checked points={data} onPointsChange={setData} />
    </div>
  );
};

export default Demo;
