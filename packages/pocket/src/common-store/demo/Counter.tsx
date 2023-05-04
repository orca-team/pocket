import React, { useState } from 'react';
import styles from './Counter.module.less';
import CounterStore from './CounterStore';

export interface CounterProps extends React.HTMLAttributes<HTMLDivElement> {
  // store 作为属性，外部可以将 store 传递
  counter?: CounterStore;
}

// 声明一个可继承的 hook（类似 useForm 如果外部传入了 store ，则使用外部的，否则使用内部的）
function useStore(_store?: CounterStore) {
  const [store] = useState(() => new CounterStore());
  return _store ?? store;
}

const Counter = (props: CounterProps) => {
  const { className, counter: _counter, ...otherProps } = props;
  // 获得 store，如果外部有传递 store 则使用外部的，否则使用内置的
  const counter = useStore(_counter);
  // 组件内部直接使用 store 提供的 useState 获取状态
  const { count } = counter.useState();
  return (
    <div className={`${styles.root} ${className}`} {...otherProps}>
      {/* 使用 store 提供的方法进行状态修改 */}
      <div
        className={styles.button}
        onClick={() => {
          counter.minus();
        }}
      >
        -
      </div>
      <div className={styles.value}>{count}</div>
      <div
        className={styles.button}
        onClick={() => {
          counter.add();
        }}
      >
        +
      </div>
    </div>
  );
};

Counter.useStore = useStore;

export default Counter;
