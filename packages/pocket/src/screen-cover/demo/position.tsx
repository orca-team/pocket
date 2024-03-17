import { Button, Spin } from 'antd';
import { useState } from 'react';
import ScreenCover from '../ScreenCover';

const Demo = () => {
  const [visible, setVisible] = useState<boolean>();

  const handleClick = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  return (
    <div>
      <Button type="primary" onClick={handleClick}>
        全屏加载（top 100px）
      </Button>
      <ScreenCover visible={visible} position={{ top: 100 }}>
        <Spin spinning size="large" />
      </ScreenCover>
    </div>
  );
};

export default Demo;
