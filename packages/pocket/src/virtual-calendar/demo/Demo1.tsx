/**
 * title: 基础用法
 * description: Demo 的描述
 */
import React, { useState } from 'react';
import type { Moment } from 'moment';
import moment from 'moment';
// 引入中文
import 'moment/locale/zh-cn';
import { useCalendarRef, VirtualCalendar } from '@orca-fe/pocket';
import { DatePicker } from 'antd';

window.moment = moment;

moment.updateLocale('zh-cn', {
  week: {
    dow: 0,
  },
});

const Demo1 = () => {
  const [checked, setChecked] = useState<Moment | undefined>();
  const ref = useCalendarRef();

  return (
    <div>
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
      <VirtualCalendar
        ref={ref}
        checked={checked}
        onDateClick={(date) => {
          setChecked(date);
        }}
      />
    </div>
  );
};

export default Demo1;
