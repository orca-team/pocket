/**
 * title: Default usage
 * desc:
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN:
 */

import { Trigger } from '@orca-fe/pocket';
import { Button } from 'antd';
import React from 'react';

const Demo = () => (
  <div>
    <Trigger popup={<div>TriggerContent</div>}>
      <Button>Show Trigger</Button>
    </Trigger>
  </div>
);

export default Demo;
