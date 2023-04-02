/**
 * title: Default usage
 * desc:
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN:
 */

import React from 'react';
import { Flop } from '@orca-fe/pocket';

const Demo = () => (
  <div>
    <Flop value={12345} convertUnit={false} />
    <br />
    <Flop prefix="$" value={123450000} />
    <br />
    <Flop prefix="数量：" value={200000} convertUnit={false} suffix="个" />
    <br />
  </div>
);

export default Demo;
