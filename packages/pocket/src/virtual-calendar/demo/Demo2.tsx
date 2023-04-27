/**
 * title: 卡片模式
 * description: 用于嵌套在空间有限的容器中
 */
import React, { useState } from 'react';
import type { Moment } from 'moment';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { DatePicker, Radio, Space } from 'antd';
import type { CardCalendarProps } from '@orca-fe/pocket';
import { CardCalendar, useCalendarRef } from '@orca-fe/pocket';

moment.updateLocale('zh-cn', {
  week: {
    dow: 0,
  },
});

const Demo2 = () => {
  const [checked, setChecked] = useState<Moment | undefined>();
  const [checkMode, setCheckMode] = useState<CardCalendarProps['checkMode']>('day');
  const ref = useCalendarRef();

  return (
    <div>
      <Space>
        <div>
          跳转至：
          <DatePicker
            onChange={(date) => {
              if (ref.current && date) {
                ref.current.scrollTo(date.format('YYYY-MM-DD'));
              }
            }}
          />
        </div>
        <div>
          选择模式：
          <Radio.Group
            value={checkMode}
            onChange={(e) => {
              setCheckMode(e.target.value);
            }}
          >
            <Radio.Button value="day">按日</Radio.Button>
            <Radio.Button value="week">按周</Radio.Button>
            <Radio.Button value={false}>不可选中</Radio.Button>
          </Radio.Group>
        </div>
      </Space>

      <CardCalendar
        ref={ref}
        checkMode={checkMode}
        checked={checked}
        onDateClick={(date) => {
          setChecked(date);
        }}
      />
    </div>
  );
};

export default Demo2;
