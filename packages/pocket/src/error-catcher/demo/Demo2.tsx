/* eslint-disable prefer-template,@typescript-eslint/restrict-plus-operands */
import React, { useState } from 'react';
import { ErrorCatcher } from '@orca-fe/pocket';
import { Button } from 'antd';
import 'antd/es/button/style';

// 一个不稳定的 mock 接口
const apiNotStable = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 300 + 300);
  });
  // 有一定几率无法返回结果
  if (Math.random() < 0.3) return null;
  return {
    errCode: 0,
    data: `result: ${Math.random()}`,
  };
};

const ComponentWithError = () => {
  const [result, setResult] = useState<{ errCode: number; data: string }>({
    errCode: 0,
    data: 'no result',
  });

  return (
    <div>
      <span>{result.data}</span>
      <Button
        onClick={async () => {
          const result = await apiNotStable();
          // @ts-expect-error
          setResult(result);
        }}
      >
        Fetch
      </Button>
    </div>
  );
};

const Demo = () => (
  <div>
    <p>
      errorTips 允许传入通过回调函数的方式获得异常信息，也能够通过 reset
      重新渲染
    </p>
    <ErrorCatcher
      errorTips={(error, errorInfo, reset) => (
        <div style={{ color: 'red' }}>
          <div>
            服务出现异常
            <Button onClick={reset}>点此重新加载</Button>
          </div>
          <pre>{errorInfo.componentStack}</pre>
        </div>
      )}
    >
      <ComponentWithError />
    </ErrorCatcher>
  </div>
);

export default Demo;
