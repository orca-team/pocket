/**
 * title: 网格布局拖拽 使用 SortableHelper 实现
 * description: 由于默认情况下，就是网格布局策略，不需要设置 `strategy` 属性
 */

import React, { useState } from 'react';
import { SortableHelper, SortableHelperItem } from '@orca-fe/dnd';
import { Card } from 'antd';

const randNum = () => Math.trunc(Math.random() * 255);
const defaultData = [
  { key: '1', title: 'title1', content: 'content1', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
  { key: '2', title: 'title2', content: 'content2', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
  { key: '3', title: 'title3', content: 'content3', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
  { key: '4', title: 'title4', content: 'content4', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
  { key: '5', title: 'title5', content: 'content5', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
  { key: '6', title: 'title6', content: 'content6', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
];

export default () => {
  const [data, setData] = useState(defaultData);
  return (
    <SortableHelper keyManager="key" data={data} onChange={setData}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        {data.map(({ key, content, title, color }, index) => (
          <SortableHelperItem key={key} row={index} style={{ padding: '12px' }}>
            <Card title={title} bodyStyle={{ backgroundColor: color }}>
              {content}
            </Card>
          </SortableHelperItem>
        ))}
      </div>
    </SortableHelper>
  );
};
