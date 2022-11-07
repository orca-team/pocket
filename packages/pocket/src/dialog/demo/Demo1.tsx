/**
 * title: Default usage
 * desc:
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN:
 */

import React, { useState } from 'react';
import { Button } from 'antd';
import { Dialog } from '@orca-fe/pocket';

const Demo = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Show
      </Button>
      <Dialog
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
