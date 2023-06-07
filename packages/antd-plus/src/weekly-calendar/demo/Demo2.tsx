/**
 * title: 日程数据
 * description: 可自定义渲染任务区块中的内容
 */

import type { WeeklyCalendarProps } from '@orca-fe/antd-plus';
import { WeeklyCalendar } from '@orca-fe/antd-plus';
import { Radio, Tooltip } from 'antd';
import React, { useState } from 'react';
import generateData from './generateData';

// 随机生成数据
const data = generateData({ length: 80 });

const Demo2 = () => {
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
      <WeeklyCalendar data={data} mode={mode} style={{ height: 800 }}>
        {item => (
          <Tooltip title={`${item.start.format('MM-DD HH:mm')} -> ${item.end.format('MM-DD HH:mm')}`}>
            <div>{item.title}</div>
          </Tooltip>
        )}
      </WeeklyCalendar>
    </div>
  );
};

export default Demo2;
