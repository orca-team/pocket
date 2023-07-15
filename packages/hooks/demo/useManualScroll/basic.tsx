import React, { useRef } from 'react';
import { useManualScroll } from '@orca-fe/hooks';

export default () => {
  const ref = useRef<HTMLDivElement>(null);
  const { run, scrollToLeft, scrollToRight, scrollToTop, scrollToBottom } = useManualScroll(ref, { scrollStep: 200 });

  return (
    <div>
      <div ref={ref} style={{ width: 400, height: 400, overflow: 'auto', background: '#d3d3d3' }}>
        <div style={{ width: 2000, height: 2000 }} />
      </div>
      <div style={{ marginTop: 12, display: 'flex' }}>
        <button
          type="button"
          disabled={scrollToLeft}
          onClick={() => {
            run('left');
          }}
        >
          向左滚动
        </button>
        <button
          type="button"
          disabled={scrollToRight}
          onClick={() => {
            run('right');
          }}
          style={{ marginLeft: 8 }}
        >
          向右滚动
        </button>
        <button
          type="button"
          disabled={scrollToTop}
          onClick={() => {
            run('up');
          }}
          style={{ marginLeft: 8 }}
        >
          向上滚动
        </button>
        <button
          type="button"
          disabled={scrollToBottom}
          onClick={() => {
            run('down');
          }}
          style={{ marginLeft: 8 }}
        >
          向下滚动
        </button>
      </div>
    </div>
  );
};
