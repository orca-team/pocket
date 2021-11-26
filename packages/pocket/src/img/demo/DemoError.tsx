/**
 * title: Error Tips
 * desc: Custom error tips with prop `errSrc`
 *
 * title.zh-CN: 错误提示
 * desc.zh-CN: 设置 `errSrc` 属性，在图片加载失败时显示。
 */
import React from 'react';
import { Img } from '@orca-fe/pocket';

const errSrc = `${window['publicPath']}/error.jpg`;

const Demo = () => (
  <div>
    <div>默认Error样式</div>
    <Img src="err url" style={{ width: 100, height: 100 }} />
    <div>自定义Error图片</div>
    <Img src="err url" errSrc={errSrc} style={{ width: 100, height: 100 }} />
    <div>自定义Error Element</div>
    <Img
      src="err url"
      errSrc={
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
            height: '100%',
          }}
        >
          Custom Error
        </div>
      }
      style={{ width: 100, height: 100 }}
    />
  </div>
);

export default Demo;
