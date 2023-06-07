/**
 * title: 周视图/日视图
 * description: 最基本的展示效果
 */
import React, { useState } from 'react';
import type { WeeklyCalendarProps } from '@orca-fe/antd-plus';
import { WeeklyCalendar } from '@orca-fe/antd-plus';
import { Radio } from 'antd';

const Demo1 = () => {
  const [mode, setMode] = useState<WeeklyCalendarProps['mode']>('week');
  return (
    <div>
      <Radio.Group
        value={mode}
        onChange={(e) => {
          setMode(e.target.value);
        }}
      >
        <Radio.Button value="week">周视图</Radio.Button>
        <Radio.Button value="day">日视图</Radio.Button>
      </Radio.Group>
      <WeeklyCalendar mode={mode} />
    </div>
  );
};

export default Demo1;
