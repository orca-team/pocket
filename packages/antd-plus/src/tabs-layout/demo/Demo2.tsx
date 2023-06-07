/**
 * title: 标签自身的操作
 */
import React, { useContext, useEffect } from 'react';
import { TabsLayout } from '@orca-fe/antd-plus';
import { Button, Space } from 'antd';

const Content = () => {
  const currentTab = useContext(TabsLayout.TabConfigContext);
  return (
    <div>
      <div>{`${currentTab.params.text}`}</div>
      <div>
        当前页签：
        {`${currentTab.isActive ? '已激活' : '未激活'}`}
      </div>
      <Space>
        <Button
          onClick={() => {
            currentTab.close();
          }}
        >
          关闭当前标签
        </Button>
        <Button
          onClick={() => {
            setTimeout(() => {
              currentTab.active();
            }, 2000);
          }}
        >
          激活当前页签（2秒后）
        </Button>
      </Space>
    </div>
  );
};

const Demo = () => {
  const tab = useContext(TabsLayout.TabsLayoutContext);
  useEffect(() => {
    // 添加几个页签
    tab.add({
      key: 'tab1',
      title: 'Tab 1',
      params: { text: 'hello world' },
      content: <Content />,
    });
    tab.add({
      key: 'tab2',
      title: 'Tab 2',
      params: { text: 'good day' },
      content: <Content />,
    });
    tab.add({
      key: 'tab3',
      title: 'Tab 3',
      params: { text: 'bye bye' },
      content: <Content />,
    });
  }, []);
  return null;
};

export default () => (
  <TabsLayout emptyContent={<div>当前无页签</div>}>
    <Demo />
    <TabsLayout.View />
  </TabsLayout>
);
