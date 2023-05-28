import React from 'react';

export interface ClockProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  p1?: number;
  p2?: number;
}

const Clock: React.FC<ClockProps> = (props) => {
  const { size = 200, p1 = 0, p2 = 0 } = props;
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: '50%',
        border: '2px solid #CCCCCC',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: size / 2 - 3,
          width: 6,
          height: size / 2 - 1,
          opacity: 0.7,
          transformOrigin: 'bottom center',
          transform: `rotate(${p1}deg)`,
          backgroundColor: '#1199ff',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: size / 2 - 3,
          width: 6,
          height: size / 2 - 1,
          opacity: 0.7,
          transformOrigin: 'bottom center',
          transition: 'transform 500ms',
          transform: `rotate(${p2}deg)`,
          backgroundColor: '#ff9911',
        }}
      />
    </div>
  );
};

export default Clock;
