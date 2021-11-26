/* eslint-disable prefer-template,@typescript-eslint/restrict-plus-operands */
import React, { useState } from 'react';
import { ErrorCatcher } from '@orca-fe/pocket';
import { Button } from 'antd';
import 'antd/es/button/style';

const ComponentWithError = () => {
  const [num, setNum] = useState(Math.random() * 10);

  return (
    <div>
      <span>{num.toFixed(2)}</span>
      <Button
        onClick={() => {
          const number = num - Math.random() * 3;
          // 错误地将 num 改为了 string 类型，导致渲染报错
          setNum(number > '0' ? number : '0');
        }}
      >
        Click me
      </Button>
    </div>
  );
};

const Demo = () => (
  <div>
    <p>ErrorCatcher 能够拦截内部元素在渲染时出现的异常</p>
    <p>
      下面的组件，点击按钮后，可能会错误地将 number 设置为 string，导致渲染异常
    </p>
    <ErrorCatcher errorTips="哎呀，这里出现了一点问题">
      <ComponentWithError />
    </ErrorCatcher>
    <ErrorCatcher errorTips="哎呀，这里出现了一点问题">
      <ComponentWithError />
    </ErrorCatcher>
    <ErrorCatcher errorTips="哎呀，这里出现了一点问题">
      <ComponentWithError />
    </ErrorCatcher>
    <p>下面这个组件，未被包裹，报错将导致白屏</p>
    <ComponentWithError />
  </div>
);

export default Demo;
