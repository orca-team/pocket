import React, { useState } from 'react';
import { ScreenCover } from '@orca-fe/pocket';
import { Button, Spin } from 'antd';

const Demo = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  return (
    <div>
      <Button type="primary" onClick={handleClick}>
        全屏加载
      </Button>
      <ScreenCover open={open}>
        <Spin spinning size="large" />
      </ScreenCover>
    </div>
  );
};

export default Demo;
