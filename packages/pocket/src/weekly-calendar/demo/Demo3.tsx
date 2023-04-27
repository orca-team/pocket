/**
 * title: 常规案例
 * description: 这里展示一个比较常规的二次开发案例
 */

import { floorBy } from '@orca-fe/tools';
import type { WeeklyCalendarProps } from '@orca-fe/pocket';
import { WeeklyCalendar } from '@orca-fe/pocket';
import { Radio } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useState } from 'react';
import ScheduleItem from './components/ScheduleItem/ScheduleItem';
import generateData from './generateData';

const Demo3 = () => {
  const [mode, setMode] = useState<WeeklyCalendarProps['showNow']>(true);
  const [data, setData] = useState(() => generateData({ length: 10, randomColor: false }));
  const [placeholder, setPlaceholder] = useState<WeeklyCalendarProps['placeholder']>(undefined);
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
      <WeeklyCalendar
        placeholder={placeholder}
        data={data}
        onEmptyClick={(time) => {
          const floor = floorBy(15 * 60 * 1000);
          // 点击了空白区域，表示新增，默认给一个 1 小时的范围
          const start = moment(floor(time.clone().add(-30, 'minute')
            .toDate()
            .getTime()));
          const end = moment(floor(time.clone().add(30, 'minute')
            .toDate()
            .getTime()));
          setPlaceholder({
            start,
            end,
          });
        }}
        renderPlaceholder={({ start, end }) => (
          <ScheduleItem
            add
            data={{ range: [dayjs(start.toDate()), dayjs(end.toDate())] }}
            onDataChange={(newItem) => {
              setPlaceholder(undefined);
              setData([
                ...data,
                {
                  title: newItem.title || '',
                  start: moment(newItem.range[0].toDate()),
                  end: moment(newItem.range[1].toDate()),
                  color: undefined,
                },
              ]);
            }}
            onCancel={() => {
              setPlaceholder(undefined);
            }}
          />
        )}
      >
        {(item, index) => (
          // 注意，因为我用了 antd@5，它的日期选择器内置的是 dayjs，所以我在这里将 moment 转成了 dayjs，antd@4 是不需要转的
          <ScheduleItem
            data={{
              title: item.title,
              range: [dayjs(item.start.toDate()), dayjs(item.end.toDate())],
            }}
            onDataChange={(changedItem) => {
              const newData = data.slice();
              newData[index] = {
                title: changedItem.title || '',
                start: moment(changedItem.range[0].toDate()),
                end: moment(changedItem.range[1].toDate()),
                color: undefined,
              };
              setData(newData);
            }}
          />
        )}
      </WeeklyCalendar>
    </div>
  );
};

export default Demo3;
