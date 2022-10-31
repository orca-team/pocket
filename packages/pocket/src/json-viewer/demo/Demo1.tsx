/**
 * title: Default usage
 * desc:
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN:
 */

import React, { useState } from 'react';
import { JsonViewer } from '@orca-fe/pocket';

const Demo = () => {
  const [value, setValue] = useState({
    number: 123,
    key: 'value',
    obj: {
      a: 1,
      b: 2,
      c: 'def',
    },
    arr: [1, 2, 'a', 'b', true, false, undefined, null],
    booleanValue: true,
    emptyValue: undefined,
    nullValue: null,
  });

  return (
    <div>
      <JsonViewer editable value={value} onChange={setValue} />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};

export default Demo;
