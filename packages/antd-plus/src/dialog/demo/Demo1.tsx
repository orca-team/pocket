/**
 * title: Default usage
 * desc:
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN:
 */

import React, { useState } from 'react';
import { Button, Radio, Space } from 'antd';
import { Dialog } from '@orca-fe/antd-plus';

const Demo = () => {
  const [open, setOpen] = useState(false);

  const [size, setSize] = useState<'large' | 'middle' | 'small'>('large');

  return (
    <div>
      <Space direction="vertical">
        <Radio.Group
          value={size}
          onChange={(e) => {
            setSize(e.target.value);
          }}
          buttonStyle="solid"
        >
          <Radio.Button value="large">大</Radio.Button>
          <Radio.Button value="middle">中</Radio.Button>
          <Radio.Button value="small">小</Radio.Button>
        </Radio.Group>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          Show
        </Button>
      </Space>
      <Dialog
        size={size}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div>对话框内容</div>
      </Dialog>
    </div>
  );
};

export default Demo;
