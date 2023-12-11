/**
 * title: Demo
 * debug: true
 */
import React, { useState } from 'react';
import { SortableHelper } from '@orca-fe/dnd';

const randNum = () => Math.trunc(Math.random() * 255);
const defaultData = [
  { key: '1', title: 'title1', content: 'content1', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
  { key: '2', title: 'title2', content: 'content2', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
  { key: '3', title: 'title3', content: 'content3', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
  { key: '4', title: 'title4', content: 'content4', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
  { key: '5', title: 'title5', content: 'content5', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
  { key: '6', title: 'title6', content: 'content6', color: `rgba(${randNum()},${randNum()},${randNum()},0.1)` },
].map(item => ({
  ...item,
  children: new Array(3).fill(0)
    .map((_, index) => ({
      key: `${item.key}-${index}`,
      title: `${item.title}-${index}`,
      content: `${item.content}-${index}`,
      color: `rgba(${randNum()},${randNum()},${randNum()},0.1)`,
    })),
}));

export default () => {
  const [data, setData] = useState(defaultData);
  return (
    <SortableHelper
      keyManager="key"
      data={data}
      onChange={setData}
      multiple={{
        getChildren: item => item.children,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {data.map(({ key, content, title, color }, index) => (
          <SortableHelper.SubSortable key={key} row={index} style={{ backgroundColor: color, padding: 12 }}>
            {item => (
              <div style={{ backgroundColor: item.color }}>
                <div>{item.title}</div>
                <div>{item.content}</div>
              </div>
            )}
          </SortableHelper.SubSortable>
        ))}
      </div>
    </SortableHelper>
  );
};
