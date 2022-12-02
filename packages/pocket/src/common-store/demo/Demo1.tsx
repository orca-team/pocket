import React from 'react';
import { Button, Space } from 'antd';
import Counter from './Counter';

const Demo1 = () => {
  // 在需要交互的父组件中，调用 useStore
  const counter = Counter.useStore();
  const { count } = counter.useState();
  return (
    <div>
      计数器1（状态内部维护）：
      <Counter />
      计数器2（外部可交互）：
      <Counter counter={counter} />
      <div>
        计数器2的值是：
        {count}
      </div>
      <Space>
        <Button
          onClick={() => {
            counter.minus();
          }}
        >
          减1
        </Button>
        <Button
          onClick={() => {
            counter.add();
          }}
        >
          加1
        </Button>
      </Space>
    </div>
  );
};
export default Demo1;
