/**
 * title: 国际化
 * description: 你需要通过 moment 设置国际化，以及每周的第一天
 * iframe: 500
 */

import moment from 'moment';
// 引入 moment 的中文包，将 moment切换为中文模式
import 'moment/locale/zh-cn';
import type { WeeklyCalendarProps } from '@orca-fe/antd-plus';
import { WeeklyCalendar } from '@orca-fe/antd-plus';
import { Descriptions, Radio, Tooltip } from 'antd';
import React, { useState } from 'react';
import generateData from './generateData';

// ！！！请预先设置一次 dow，否则后续切换的时候，已生成的 moment 数据的 dow 不会变
moment.updateLocale('zh-cn', {
  week: {
    dow: 0,
  },
});

const data = generateData({ length: 80 });
const Demo4 = () => {
  const [mode, setMode] = useState<WeeklyCalendarProps['mode']>('week');
  const [refreshKey, setRefreshKey] = useState(1);
  return (
    <div style={{ padding: 32 }}>
      <Descriptions layout="vertical">
        <Descriptions.Item label="视图切换">
          <Radio.Group
            buttonStyle="solid"
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
            }}
          >
            <Radio.Button value="week">周视图</Radio.Button>
            <Radio.Button value="day">日视图</Radio.Button>
          </Radio.Group>
        </Descriptions.Item>
        <Descriptions.Item label="每周的第一天">
          <Radio.Group
            onChange={(e) => {
              moment.updateLocale('zh-cn', {
                week: {
                  dow: e.target.value,
                },
              });
              setRefreshKey(refreshKey + 1);
            }}
          >
            <Radio.Button value={0}>周日</Radio.Button>
            <Radio.Button value={1}>周一</Radio.Button>
            <Radio.Button value={2}>周二</Radio.Button>
            <Radio.Button value={3}>周三</Radio.Button>
            <Radio.Button value={4}>周四</Radio.Button>
            <Radio.Button value={5}>周五</Radio.Button>
            <Radio.Button value={6}>周六</Radio.Button>
          </Radio.Group>
        </Descriptions.Item>
      </Descriptions>
      <WeeklyCalendar key={refreshKey} mode={mode} data={data} style={{ height: 600 }}>
        {item => (
          <Tooltip title={`${item.start.format('MM-DD HH:mm')} -> ${item.end.format('MM-DD HH:mm')}`}>
            <div>{item.title}</div>
          </Tooltip>
        )}
      </WeeklyCalendar>
    </div>
  );
};

export default Demo4;
