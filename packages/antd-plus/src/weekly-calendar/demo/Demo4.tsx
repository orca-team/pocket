/**
 * title: 日程精度(precision)
 * description: 默认日程的精度为15分钟（不足15分钟的时间点向前取整，你可以调整精度查看日程的结束时间，以及日程并行的排列方式）
 */

import moment from 'moment';
import type { WeeklyCalendarProps } from '@orca-fe/antd-plus';
import { WeeklyCalendar } from '@orca-fe/antd-plus';
import { DatePicker, Descriptions, Radio, Tooltip } from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';

const data = [
  {
    title: 'task1',
    color: '#FCC',
    start: moment().hour(2)
      .minute(0),
    end: moment().hour(3)
      .minute(0),
  },
  {
    title: 'task2',
    color: '#CFC',
    start: moment().hour(2)
      .minute(0),
    end: moment().hour(3)
      .minute(5),
  },
  {
    title: 'task3',
    color: '#CCF',
    start: moment().hour(2)
      .minute(0),
    end: moment().hour(3)
      .minute(10),
  },
  {
    title: 'task4',
    color: '#FFC',
    start: moment().hour(2)
      .minute(0),
    end: moment().hour(3)
      .minute(15),
  },
  {
    title: 'task5',
    color: '#CFF',
    start: moment().hour(2)
      .minute(0),
    end: moment().hour(3)
      .minute(35),
  },
  {
    title: 'task6',
    color: '#FCF',
    start: moment().hour(3)
      .minute(20),
    end: moment().hour(4)
      .minute(0),
  },
];
const Demo4 = () => {
  const [mode, setMode] = useState<WeeklyCalendarProps['mode']>('week');
  const [precision, setPrecision] = useState<WeeklyCalendarProps['precision']>(15);
  const [current, setCurrent] = useState(dayjs());
  const currentMoment = moment(current.toDate());
  return (
    <div>
      <Descriptions layout="vertical" column={4}>
        <Descriptions.Item label="当前时间">
          <DatePicker
            value={current}
            onChange={(d) => {
              setCurrent(d || dayjs());
            }}
          />
        </Descriptions.Item>
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
        <Descriptions.Item label="日程精度(precision)" span={2}>
          <Radio.Group
            buttonStyle="solid"
            value={precision}
            onChange={(e) => {
              setPrecision(e.target.value);
            }}
          >
            <Radio.Button value={5}>5分钟</Radio.Button>
            <Radio.Button value={10}>10分钟</Radio.Button>
            <Radio.Button value={15}>15分钟</Radio.Button>
            <Radio.Button value={20}>20分钟</Radio.Button>
            <Radio.Button value={30}>30分钟</Radio.Button>
            <Radio.Button value={60}>60分钟</Radio.Button>
          </Radio.Group>
        </Descriptions.Item>
      </Descriptions>

      <WeeklyCalendar precision={precision} data={data} mode={mode} current={currentMoment}>
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
