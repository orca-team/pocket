/**
 * title: Default usage
 * desc:
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN:
 */

import React from 'react';
import { EqRatioImg } from '@orca-fe/pocket';

const imgSrc = `${window['publicPath'] ?? '/'}tmp.jpg`;

const Demo = () => (
  <div>
    <div>默认 normal 模式，设置宽度为150：</div>
    <EqRatioImg src={imgSrc} style={{ width: 150 }} />

    <div>给定宽高 150x150，scale 模式，图片被拉伸变形填满</div>
    <EqRatioImg
      src={imgSrc}
      mode="scale"
      style={{ width: 150, height: 150, border: '1px solid #666666' }}
    />

    <div>给定宽高 150x150，cover 模式，图片等比缩放，占满容器</div>
    <EqRatioImg
      src={imgSrc}
      mode="cover"
      style={{ width: 150, height: 150, border: '1px solid #666666' }}
    />

    <div>给定宽高 150x150，contain 模式，图片等比缩放，保证完整显示</div>
    <EqRatioImg
      src={imgSrc}
      mode="contain"
      style={{ width: 150, height: 150, border: '1px solid #666666' }}
    />

    <div>默认 normal 模式，不设置宽度，默认会按宽度拉伸至 100%：</div>
    <EqRatioImg src={imgSrc} />
  </div>
);

export default Demo;
