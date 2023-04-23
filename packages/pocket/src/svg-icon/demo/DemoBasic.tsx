/**
 * title: 基础用法
 * desc: 这里展示了
 */

import React from 'react';
import { IconButton, SvgIcon } from '@orca-fe/pocket';
import { Space, Tooltip } from 'antd';
import { iconChat, iconList, iconLocationPointRed, iconPolygon } from './icon';

const Demo = () => (
  <div>
    <div>渲染所有图标</div>
    <Space wrap>
      {iconList.map((icon, index) => (
        <Tooltip key={index} title={icon.name}>
          <IconButton>
            <SvgIcon icon={icon} />
          </IconButton>
        </Tooltip>
      ))}
    </Space>
    <div>修改图标默认颜色（仅无色图标）</div>
    <Space wrap>
      {iconList.map((icon, index) => (
        <Tooltip key={index} title={icon.name}>
          <SvgIcon icon={icon} color="orange" />
        </Tooltip>
      ))}
    </Space>

    <div style={{ marginTop: 8 }}>自定义尺寸</div>
    <Space wrap>
      {iconList.map((icon, index) => (
        <Tooltip key={index} title={icon.name}>
          <SvgIcon icon={icon} size={32} />
        </Tooltip>
      ))}
    </Space>

    <div style={{ marginTop: 8 }}>旋转图标</div>
    <SvgIcon icon={iconPolygon} spinning size={20} />

    <div style={{ marginTop: 8 }}>修改多色图标的特定颜色</div>
    <Space wrap>
      <SvgIcon icon={iconChat} size={20} customPathProps={[{ fill: '#66cc66' }]} />
      <SvgIcon icon={iconChat} size={20} customPathProps={[{ fill: '#ff9911' }]} />
      <SvgIcon icon={iconChat} size={20} customPathProps={[{ fill: '#cc0000' }, { fill: '#ffc711' }]} />
      <SvgIcon icon={iconLocationPointRed} size={32} customPathProps={[{ fill: '#2f6b2f' }, { fill: '#16de16' }, { fill: '#359b35' }]} />
      <SvgIcon icon={iconLocationPointRed} size={32} customPathProps={[{ fill: '#6830ad' }, { fill: '#a637ff' }, { fill: '#1153cc' }]} />
    </Space>
  </div>
);

export default Demo;
