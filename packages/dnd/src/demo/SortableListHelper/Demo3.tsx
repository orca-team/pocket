/**
 * title: 基础用法
 * description: 通过 children 渲染列表项
 */
import React, { useState } from 'react';
import { SortableListHelper, SortableListHelperItem, SortHandle } from '@orca-fe/dnd';
import { Table } from 'antd';
import { IconButton } from '@orca-fe/pocket';
import { MenuOutlined } from '@ant-design/icons';

const Row = (props) => {
  const { 'data-row-index': row = -1 } = props;
  return <SortableListHelperItem {...props} tag="tr" row={row} />;
};

const defaultData = [
  { key: '1', title: 'title1', content: 'content1' },
  { key: '2', title: 'title2', content: 'content2' },
  { key: '3', title: 'title3', content: 'content3' },
  { key: '4', title: 'title4', content: 'content4' },
  { key: '5', title: 'title5', content: 'content5' },
  { key: '6', title: 'title6', content: 'content6' },
];

export default () => {
  const [data, setData] = useState(defaultData);

  return (
    <SortableListHelper customHandle data={data} onChange={setData}>
      <Table
        columns={[
          {
            title: 'sort',
            render: () => (
              <SortHandle>
                <IconButton style={{ cursor: 'move' }}>
                  <MenuOutlined />
                </IconButton>
              </SortHandle>
            ),
          },
          { title: 'title', dataIndex: 'title' },
          { title: 'content', dataIndex: 'content' },
        ]}
        dataSource={data}
        onRow={(record, index) => ({ ...record, 'data-row-index': index })}
        components={{
          body: {
            row: Row,
          },
        }}
      />
    </SortableListHelper>
  );
};
