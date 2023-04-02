/**
 * title: 自定义拖拽 handle
 */

import React, { useState } from 'react';
import { DraggableList } from '@orca-fe/pocket';
import cn from 'classnames';
import { DragOutlined } from '@ant-design/icons';
import styles from './Demo2.module.less';

/**
 * item must with key
 */
const defaultData = [
  {
    key: 'aaaa',
    text: 'aaaa',
  },
  {
    key: 'bbbb',
    text: 'bbbb',
  },
  {
    key: 'cccc',
    text: 'cccc',
  },
  {
    key: 'dddd',
    text: 'dddd',
  },
];

export default () => {
  const [data, setData] = useState(defaultData);

  return (
    <DraggableList data={data} onDataChange={setData} customDragHandler customStyle>
      {(item, { dragging, checked, drag }, index) => (
        <div
          className={cn(styles.item, {
            [styles.dragging]: dragging,
            [styles.checked]: checked,
          })}
        >
          <DragOutlined
            className={styles.handle}
            draggable
            onDrag={(e) => {
              e.preventDefault();
              drag();
            }}
          />
          {item.text}
        </div>
      )}
    </DraggableList>
  );
};
