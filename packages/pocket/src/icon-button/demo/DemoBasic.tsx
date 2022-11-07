/**
 * title: Default usage
 * desc:
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN:
 */

import React from 'react';
import { IconButton } from '@orca-fe/pocket';
import { Space } from 'antd';
import {
  CaretLeftFilled,
  FileOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const Demo = () => (
  <div>
    <div>结合 @ant-design/icons 使用</div>
    <Space style={{ padding: 4 }}>
      <IconButton>
        <FileOutlined />
      </IconButton>
      <IconButton>
        <SettingOutlined />
      </IconButton>
      <IconButton>
        <CaretLeftFilled />
      </IconButton>
      <IconButton>
        <ReloadOutlined />
      </IconButton>
    </Space>
    <br />
    <div>Dark 模式</div>
    <Space style={{ backgroundColor: '#333', padding: 4 }}>
      <IconButton theme="dark">
        <FileOutlined />
      </IconButton>
      <IconButton theme="dark">
        <SettingOutlined />
      </IconButton>
      <IconButton theme="dark">
        <CaretLeftFilled />
      </IconButton>
      <IconButton theme="dark">
        <ReloadOutlined />
      </IconButton>
    </Space>
    <br />
    <div>大尺寸</div>
    <Space style={{ padding: 4 }}>
      <IconButton size="large">
        <FileOutlined />
      </IconButton>
      <IconButton size="large">
        <SettingOutlined />
      </IconButton>
      <IconButton size="large">
        <CaretLeftFilled />
      </IconButton>
      <IconButton size="large">
        <ReloadOutlined />
      </IconButton>
    </Space>
    <br />
    <div>小尺寸</div>
    <Space style={{ padding: 4 }}>
      <IconButton size="small">
        <FileOutlined />
      </IconButton>
      <IconButton size="small">
        <SettingOutlined />
      </IconButton>
      <IconButton size="small">
        <CaretLeftFilled />
      </IconButton>
      <IconButton size="small">
        <ReloadOutlined />
      </IconButton>
    </Space>
    <br />
    <div>超小尺寸</div>
    <Space style={{ padding: 4 }}>
      <IconButton size="x-small">
        <FileOutlined />
      </IconButton>
      <IconButton size="x-small">
        <SettingOutlined />
      </IconButton>
      <IconButton size="x-small">
        <CaretLeftFilled />
      </IconButton>
      <IconButton size="x-small">
        <ReloadOutlined />
      </IconButton>
    </Space>
  </div>
);

export default Demo;
