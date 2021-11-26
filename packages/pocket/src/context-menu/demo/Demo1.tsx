import React from 'react';
import { ContextMenu, ContextMenuItemWithSplitType } from '@orca-fe/pocket';
import {
  CopyOutlined,
  FileExcelOutlined,
  FileOutlined,
  FileWordOutlined,
  FileZipOutlined,
  FolderOutlined,
  PlusCircleOutlined,
  ScissorOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import 'antd/es/message/style';

const menuData: ContextMenuItemWithSplitType[] = [
  {
    key: 'cut',
    text: '剪切',
    icon: <ScissorOutlined />,
    extra: 'Ctrl+X',
  },
  {
    key: 'copy',
    text: '复制',
    icon: <CopyOutlined />,
    extra: 'Ctrl+C',
  },
  {
    key: 'paste',
    text: '粘贴',
    disabled: true,
    extra: 'Ctrl+V',
  },
  'split-line',
  {
    key: 'new',
    text: '新建',
    icon: <PlusCircleOutlined />,
    children: [
      {
        key: 'directory',
        text: '文件夹',
        icon: <FolderOutlined />,
      },
      'split-line',
      {
        key: 'text',
        text: '文本文件',
        icon: <FileOutlined />,
      },
      {
        key: 'doc',
        text: 'doc文档',
        icon: <FileWordOutlined />,
      },
      {
        key: 'xls',
        text: '表格',
        icon: <FileExcelOutlined />,
      },
      {
        key: 'zip',
        text: '压缩文件',
        icon: <FileZipOutlined />,
      },
    ],
  },
  'split-line',
  {
    key: 'setting',
    text: '设置',
    icon: <SettingOutlined />,
  },
  {
    key: 'attr',
    text: '属性',
  },
];

const Demo = () => (
  <ContextMenu
    data={menuData}
    onMenuClick={(menu) => {
      message.info(`您点击了：${String(menu.text)}`);
    }}
  >
    <div style={{ border: '1px solid #CCCCCC' }}>
      <p>这是一个自定义菜单组件</p>
      <p>将该组件作为容器包裹住你需要自定义菜单的范围</p>
      <h1>单击右键，弹出自定义菜单</h1>
    </div>
  </ContextMenu>
);

export default Demo;
