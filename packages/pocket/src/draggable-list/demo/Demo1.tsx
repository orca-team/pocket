/**
 * title: 基础用法
 */

import React, { useState } from 'react';
import { DraggableList } from '@orca-fe/pocket';

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
    <DraggableList data={data} onDataChange={setData}>
      {(item, params, index) => <div>{item.text}</div>}
    </DraggableList>
  );
};
