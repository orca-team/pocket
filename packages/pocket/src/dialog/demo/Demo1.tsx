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
  const [show, setShow] = useState(false);

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setShow(true);
        }}
      >
        Show
      </Button>
      <Dialog show={show} />
    </div>
  );
};

export default Demo;
