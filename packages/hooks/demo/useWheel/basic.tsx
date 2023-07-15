import React, { useRef } from 'react';
import { useWheel } from '@orca-fe/hooks';

const dirTextMap = {
  up: '向上滚动',
  down: '向下滚动',
  left: '向左滚动',
  right: '向右滚动',
};

export default () => {
  const ref = useRef<HTMLDivElement>(null);
  const { rolling, direction, movement, distance } = useWheel(ref);

  return (
    <div>
      <div>在下方区域使用鼠标滚轮滚动</div>
      <div ref={ref} style={{ width: 200, height: 200, margin: '12px 0', border: '1px solid #000' }} />
      <div>
        <div>{`滚轮状态: ${rolling ? '滚动中' : '已停止'}`}</div>
        <div>{`滚动方向: ${direction ? dirTextMap[direction] : '-'}`}</div>
        <div>{`本次滚动量：${movement}`}</div>
        <div>{`累计滚动距离: ${distance}`}</div>
      </div>
    </div>
  );
};
