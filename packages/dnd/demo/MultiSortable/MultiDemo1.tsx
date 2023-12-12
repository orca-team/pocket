import { SortableHelper, SortHandle } from '@orca-fe/dnd';
import { useState } from 'react';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IconButton } from '@orca-fe/pocket';
import { DragOutlined } from '@ant-design/icons';

const randNum = () => Math.trunc(Math.random() * 255);

export default () => {
  const [data, setData] = useState([
    [
      { key: '1', text: 'block_1', color: `rgba(${randNum()},${randNum()},${randNum()},0.5)` },
      { key: '2', text: 'block_2', color: `rgba(${randNum()},${randNum()},${randNum()},0.5)` },
      { key: '3', text: 'block_3', color: `rgba(${randNum()},${randNum()},${randNum()},0.5)` },
    ],
    [
      { key: '4', text: 'block_4', color: `rgba(${randNum()},${randNum()},${randNum()},0.5)` },
      { key: '5', text: 'block_5', color: `rgba(${randNum()},${randNum()},${randNum()},0.5)` },
      { key: '6', text: 'block_6', color: `rgba(${randNum()},${randNum()},${randNum()},0.5)` },
    ],
    [
      { key: '7', text: 'block_7', color: `rgba(${randNum()},${randNum()},${randNum()},0.5)` },
      { key: '8', text: 'block_8', color: `rgba(${randNum()},${randNum()},${randNum()},0.5)` },
      { key: '9', text: 'block_9', color: `rgba(${randNum()},${randNum()},${randNum()},0.5)` },
    ],
  ]);

  return (
    <SortableHelper data={data} onChange={setData} multiple={{}} customHandle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {data.map((item, index) => (
          <SortableHelper.Item key={index} row={index} style={{ padding: 12, border: '1px solid #DDD', backgroundColor: '#f6f6f6' }}>
            <SortHandle>
              <IconButton style={{ cursor: 'move' }}>
                <DragOutlined />
              </IconButton>
            </SortHandle>
            <SortableHelper.SubSortable
              row={index}
              style={{ display: 'flex', gap: 4, flexDirection: 'column' }}
              strategy={verticalListSortingStrategy}
            >
              {(item, index, key) => (
                <div style={{ backgroundColor: item.color, border: '1px solid rgba(100,100,100,0.1)', padding: 8 }}>{item.text}</div>
              )}
            </SortableHelper.SubSortable>
          </SortableHelper.Item>
        ))}
      </div>
    </SortableHelper>
  );
};
