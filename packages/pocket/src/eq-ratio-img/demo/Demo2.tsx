/**
 * title: position
 * desc: Use imgPosition to adjust the position of the image in the container
 *
 * title.zh-CN: 图片位置
 * desc.zh-CN: 通过 imgPosition 调整图片在容器中的位置
 */

import React from 'react';
import { EqRatioImg } from '@orca-fe/pocket';
import { Space } from 'antd';

const imgSrc = `${window['publicPath'] ?? '/'}tmp.jpg`;

const Demo = () => (
  <div>
    <div>top/center/bottom</div>
    <Space>
      <EqRatioImg
        src={imgSrc}
        mode="contain"
        imgPosition="top"
        style={{ width: 100, height: 200, border: '1px solid #DDD' }}
      />
      <EqRatioImg
        src={imgSrc}
        mode="contain"
        imgPosition="center"
        style={{ width: 100, height: 200, border: '1px solid #DDD' }}
      />
      <EqRatioImg
        src={imgSrc}
        mode="contain"
        imgPosition="bottom"
        style={{ width: 100, height: 200, border: '1px solid #DDD' }}
      />
    </Space>
    <div>left/center/right</div>
    <Space>
      <EqRatioImg
        src={imgSrc}
        mode="contain"
        imgPosition="left"
        style={{ width: 280, height: 100, border: '1px solid #DDD' }}
      />
      <EqRatioImg
        src={imgSrc}
        mode="contain"
        imgPosition="center"
        style={{ width: 280, height: 100, border: '1px solid #DDD' }}
      />
      <EqRatioImg
        src={imgSrc}
        mode="contain"
        imgPosition="right"
        style={{ width: 280, height: 100, border: '1px solid #DDD' }}
      />
    </Space>
    <div>percent 20%</div>
    <EqRatioImg
      src={imgSrc}
      mode="contain"
      imgPosition="20% 20%"
      style={{ width: 100, height: 200, border: '1px solid #DDD' }}
    />
    <EqRatioImg
      src={imgSrc}
      mode="contain"
      imgPosition="20% 20%"
      style={{ width: 280, height: 100, border: '1px solid #DDD' }}
    />
  </div>
);

export default Demo;
