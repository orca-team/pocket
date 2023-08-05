/**
 * title: Default usage
 * desc:
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN:
 */

import React, { useState } from 'react';
import { Flop } from '@orca-fe/pocket';
import { useInterval } from '@orca-fe/hooks';

const Demo = () => {
  const [value, setValue] = useState(123);
  useInterval(() => {
    let num = Math.random() * 10000;
    if (Math.random() > 0.7) {
      num *= 1000;
    }
    if (Math.random() > 0.7) {
      num *= 1000;
    }
    if (Math.random() > 0.5) {
      num *= Math.random() * 10000;
    }
    setValue(Math.trunc(num));
  }, 3000);
  return (
    <div>
      <Flop value={value} />
      <br />
      <Flop value={value} convertUnit={false} />
      <br />
      <Flop value={value} convertUnit={false} decimals={2} />
      <br />
      <Flop value={value} convertUnit={false} separator="，" />
      <br />
      <Flop prefix="$" value={value} />
      <br />
      <Flop prefix="数量：" value={value} convertUnit={false} suffix="个" />
      <br />
    </div>
  );
};

export default Demo;
