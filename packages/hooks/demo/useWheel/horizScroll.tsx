import React, { useEffect, useRef } from 'react';
import { useWheel, useManualScroll } from '@orca-fe/hooks';

export default () => {
  // 容器 ref
  const ref = useRef<HTMLDivElement>(null);
  const manualScroll = useManualScroll(ref, { defaultScrollStep: 300 });
  const wheelState = useWheel(ref);

  useEffect(() => {
    if (!ref.current) return;

    const { direction } = wheelState;

    // 向左滚动
    if (direction === 'left' || direction === 'up') {
      manualScroll.run('left');
    }
    // 向右滚动
    if (direction === 'right' || direction === 'down') {
      manualScroll.run('right');
    }
  }, [wheelState]);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>使用鼠标滚轮上下滚动的同时，容器内部进行左右滚动</div>
      <div ref={ref} style={{ overflow: 'auto' }}>
        <div style={{ width: 2000, height: 200, background: '#d3d3d3' }} />
      </div>
    </div>
  );
};
