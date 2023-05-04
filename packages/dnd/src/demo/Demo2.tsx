/**
 * title: 自定义拖拽按钮
 * description: 开启 `customHandle` 并使用 `SortHandle` 包裹自定义拖拽按钮。注意：`SortHandle` 包裹的组件需要能够响应 `onPointerDown` 事件
 */
import React, { useState } from 'react';
import { SortableList } from '@orca-fe/dnd';
import { IconButton } from '@orca-fe/pocket';
import { MenuOutlined } from '@ant-design/icons';
import { SortHandle } from '../SortableList';

const defaultData = [
  { title: 'title1', content: 'content1' },
  { title: 'title2', content: 'content2' },
  { title: 'title3', content: 'content3' },
  { title: 'title4', content: 'content4' },
  { title: 'title5', content: 'content5' },
  { title: 'title6', content: 'content6' },
].map(item => ({
  ...item,
  // 随机复制 1-10 行 content
  content: new Array(Math.ceil(Math.random() * 10)).fill(0)
    .map((_, index) => (
      <React.Fragment key={index}>
        {item.content}
        <br />
      </React.Fragment>
    )),
}));

const itemStyle: React.CSSProperties = {
  padding: '4px 12px',
  border: '1px solid #DDD',
  borderRadius: 8,
  marginBottom: 8,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
};

export default () => {
  const [data, setData] = useState(defaultData);

  return (
    <SortableList customHandle data={data} onChange={setData}>
      {(item, index) => (
        <div style={itemStyle}>
          <div>
            <SortHandle>
              <IconButton style={{ cursor: 'move' }}>
                <MenuOutlined />
              </IconButton>
            </SortHandle>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</div>
            <div>{item.content}</div>
          </div>
        </div>
      )}
    </SortableList>
  );
};
