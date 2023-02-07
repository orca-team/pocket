import React, { useState } from 'react';
import type { ContextMenuItemWithSplitType } from '@orca-fe/pocket';
import { ContextMenu } from '@orca-fe/pocket';
import {
  DeleteOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import 'antd/es/space/style';

const outerMenuData: ContextMenuItemWithSplitType[] = [
  {
    key: 'new',
    text: '新增',
    icon: <PlusCircleOutlined />,
    extra: 'Ctrl+N',
  },
  {
    key: 'reload',
    text: '刷新',
    icon: <ReloadOutlined />,
    extra: 'Ctrl+R',
  },
];

const itemMenuData: ContextMenuItemWithSplitType[] = [
  {
    key: 'delete',
    text: '删除',
    icon: <DeleteOutlined />,
  },
];

let index = 5;

const Demo = () => {
  const [arr, setArr] = useState(['item1', 'item2', 'item3', 'item4']);

  return (
    <ContextMenu
      data={outerMenuData}
      onMenuClick={(menu) => {
        if (menu.key === 'new') {
          setArr([...arr, `item${index}`]);
          index += 1;
        }
      }}
    >
      <div style={{ padding: 10, border: '1px solid #CCCCCC' }}>
        <p>可以进行菜单嵌套，这里外面的框和内部的框有不同的自定义菜单项</p>
        <Space>
          {arr.map((text, index) => (
            <ContextMenu
              key={index}
              data={itemMenuData}
              mainMenuMinWidth={150}
              onMenuClick={(menu) => {
                if (menu.key === 'delete') {
                  setArr(arr.filter((_, i) => i !== index));
                }
              }}
            >
              <div style={{ padding: 10, border: '1px solid #AAAAAA' }}>
                {text}
              </div>
            </ContextMenu>
          ))}
        </Space>
      </div>
    </ContextMenu>
  );
};

export default Demo;
