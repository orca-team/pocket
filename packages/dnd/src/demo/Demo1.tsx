/**
 * title: 基础用法
 * description: 通过 children 渲染列表项
 */
import React from 'react';
import { SortableList } from '@orca-fe/dnd';

const defaultData = [
  { title: 'title1', content: 'content1' },
  { title: 'title2', content: 'content2' },
  { title: 'title3', content: 'content3' },
  { title: 'title4', content: 'content4' },
  { title: 'title5', content: 'content5' },
  { title: 'title6', content: 'content6' },
];

// 如果需要 data 受控，请使用 `data` 和 `onChange`
export default () => (
  <SortableList defaultData={defaultData}>
    {(item, index) => (
      <div style={{ padding: '4px 12px', border: '1px solid #DDD', borderRadius: 8, marginBottom: 8, fontSize: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</div>
        <div>{item.content}</div>
      </div>
    )}
  </SortableList>
);
