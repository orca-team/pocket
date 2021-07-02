import React from 'react';

const Ruler = (props: { size?: number; num?: number }) => {
  const { size = 50, num = 3 } = props;
  return (
    <div
      style={{ position: 'relative', width: size * num, height: size * num }}
    >
      {new Array(num * num).fill(0).map((_, index) => {
        const row = Math.floor(index / num);
        const col = index % num;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              top: col * size,
              left: row * size,
              border: '1px solid #CCCCCC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {size}
            px
          </div>
        );
      })}
    </div>
  );
};

export default Ruler;
