import React, { useEffect, useState } from 'react';
import { ScreenCover } from '@orca-fe/pocket';
import { Button, Flex, Progress } from 'antd';
import { useRafInterval } from 'ahooks';

const Demo = () => {
  const [visible, setVisible] = useState(false);
  const [percent, setPercent] = useState(0);
  const [delay, setDelay] = useState<number>();

  const handleClick = () => {
    setVisible(true);
    setDelay(1000);
  };

  useRafInterval(
    () => {
      setPercent(percent + Math.floor(Math.random() * 11) + 10);
    },
    delay,
    { immediate: false },
  );

  useEffect(() => {
    if (percent >= 100) {
      setPercent(0);
      setDelay(undefined);
      setVisible(false);
    }
  }, [percent]);

  return (
    <div>
      <Button type="primary" onClick={handleClick}>
        全屏加载
      </Button>
      <ScreenCover visible={visible}>
        <Flex vertical align="center" justify="center" gap={6}>
          <div>进度加载中...</div>
          <Progress type="line" steps={25} percent={percent} />
        </Flex>
      </ScreenCover>
    </div>
  );
};

export default Demo;
