/**
 * title: 基本用法
 */
import React, { useContext } from 'react';
import { TabsLayout } from '@orca-fe/pocket';
import { Button, Space } from 'antd';

let index = 0;

/* 添加按钮 */
const AddButton = () => {
  const tab = useContext(TabsLayout.TabsLayoutContext);
  return (
    <Button
      type="primary"
      onClick={() => {
        index += 1;
        tab.add({
          key: `tab_${index}`, // key 为 tab 的唯一标识，如果 key 重复则不会添加
          title: `Tab ${index}`,
          content: (
            <div>
              Content of Tab
              {index}
            </div>
          ),
        });
      }}
    >
      添加
    </Button>
  );
};

/* 关闭按钮 */
const CloseButton = () => {
  const tab = useContext(TabsLayout.TabsLayoutContext);
  return (
    <Button
      onClick={() => {
        if (tab.tabs.length > 0) {
          tab.remove(tab.tabs[0].key);
        }
      }}
    >
      关闭第1个标签
    </Button>
  );
};

/* 切换按钮 */
const SwitchButton = () => {
  const tab = useContext(TabsLayout.TabsLayoutContext);
  return (
    <Button
      onClick={() => {
        if (tab.tabs.length > 1) {
          tab.active(tab.tabs[1].key);
        }
      }}
    >
      切换至第2个标签
    </Button>
  );
};

export default () => (
  <TabsLayout emptyContent={<div>当前无页签</div>}>
    <Space>
      <AddButton />
      <CloseButton />
      <SwitchButton />
    </Space>
    <div style={{ height: 12 }} />
    <TabsLayout.View />
  </TabsLayout>
);
