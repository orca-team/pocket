/**
 * title: 基础用法
 * desc: 这里展示了
 */

import React from 'react';
import { IconButton, SvgIcon } from '@orca-fe/pocket';
import { Space, Tooltip } from 'antd';
import { iconList, iconPolygon } from './icon';

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
  </div>
);

export default Demo;
