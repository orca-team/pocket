/**
 * title: 关闭事件监听
 */
import React, { useContext, useEffect } from 'react';
import { TabsLayout } from '@orca-fe/pocket';
import { Button, Modal, Space } from 'antd';
import { usePromisifyModal } from '@orca-fe/hooks';

const Content = () => {
  const currentTab = useContext(TabsLayout.TabConfigContext);

  const modal = usePromisifyModal();

  TabsLayout.useTabCloseListener(async () => {
    await modal.show(
      <Modal title="确认关闭？" okText="确认" cancelText="再看看">
        <div>确认关闭页签？当前内容可能会丢失。</div>
      </Modal>,
    );
    return true;
  });

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
      </Space>
      {modal.instance}
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
