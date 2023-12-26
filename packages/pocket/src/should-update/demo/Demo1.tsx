import React, { useState } from 'react';
import { shouldUpdate } from '@orca-fe/pocket';
import { useInterval } from 'ahooks';

const MyComponent = (props: { num: number }) => {
  const { num = 1 } = props;
  return (
    <span>
      {`${num} `}
      {Date.now()}
    </span>
  );
};

// 包裹生成一个新组件，仅在 num 属性发生变化是才重新渲染
const NotUpdateMyComponent = shouldUpdate(MyComponent, (props, prevProps) => props.num !== prevProps.num);

const Demo = () => {
  const [{ num }, setNum] = useState({ num: 0 });

  useInterval(() => {
    setNum({ num: Math.round(Math.random() * 3) });
  }, 1000);

  return (
    <div>
      <p>shouldUpdate 为你的函数组件添加是否重新渲染的能力</p>
      <div>当前时间戳：</div>
      {Date.now()}
      <p />
      <div>普通组件（永远和时间戳保持一致）：</div>
      <MyComponent num={num} />
      <p />
      <div>shouldUpdate 包裹的组件（仅 num 变化时才重新渲染）：</div>
      <NotUpdateMyComponent num={num} />
    </div>
  );
};

export default Demo;
