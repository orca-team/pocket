/**
 * title: Default usage
 * desc:
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN:
 */

import React, { useState } from 'react';
import { JsonViewer } from '@orca-fe/pocket';
import { useInterval } from 'ahooks';

const Demo = () => {
  const [value, setValue] = useState({
    abc: 1,
    def: '2',
    qqq: { lsd: 12314, bck: 'oqwiuheoqiwhr' },
    cls: null,
    und: undefined,
    hello: false,
    world: true,
    arr: new Array(10000).fill(123),
  });

  useInterval(() => {
    setValue({
      ...value,
      abc: Date.now(),
    });
  }, 1000);

  return (
    <div>
      <JsonViewer
        rootDefaultOpen
        defaultOpen={0}
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export default Demo;
