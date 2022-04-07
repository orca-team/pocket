/**
 * title: Default usage
 * desc:
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN:
 */

import React from 'react';
import { Img } from '@orca-fe/pocket';

const imgSrc = `${window['publicPath'] ?? '/'}tmp.jpg`;

const Demo = () => (
  <div>
    <div>设置宽度为50：</div>
    <Img src={imgSrc} style={{ width: 50 }} />
    <div>不设置宽度，默认大小：</div>
    <Img src={imgSrc} stretch={false} />
  </div>
);

export default Demo;
