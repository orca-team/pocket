import React, { useRef } from 'react';
import { useManualScroll } from '@orca-fe/hooks';

export default () => {
  const ref = useRef<HTMLDivElement>(null);
  const { run, position, scrollToLeft, scrollToRight, scrollToTop, scrollToBottom } = useManualScroll(ref, { defaultScrollStep: 200 });

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: 300,
          height: 300,
          border: '1px solid #AAA',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '100px '.repeat(30),
        }}
      >
        {new Array(30 * 30).fill(0)
          .map((_, index) => (
            <div key={index} style={{ width: '100px', height: '100px', border: '1px solid #CCC', boxSizing: 'border-box' }}>
              {index}
            </div>
          ))}
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
      <p>{JSON.stringify(position)}</p>
    </div>
  );
};
