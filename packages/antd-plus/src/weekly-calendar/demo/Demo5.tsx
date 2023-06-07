/**
 * title: 当前时间
 * description: 自定义当前时间 及 当前时间的颜色
 */

import moment from 'moment';
import type { WeeklyCalendarProps } from '@orca-fe/antd-plus';
import { WeeklyCalendar } from '@orca-fe/antd-plus';
import { Descriptions, Radio } from 'antd';
import React, { useState } from 'react';

const Demo5 = () => {
  const [mode, setMode] = useState<WeeklyCalendarProps['mode']>('week');
  const [showNow, setShowNow] = useState<WeeklyCalendarProps['showNow']>(true);
  const [color, setColor] = useState('#ff0000');
  return (
    <div>
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
        <Descriptions.Item label="显示当前时间">
          <Radio.Group
            buttonStyle="solid"
            value={typeof showNow === 'boolean' ? showNow : 'fixed'}
            onChange={(e) => {
              const { value } = e.target;
              if (typeof value === 'boolean') {
                setShowNow(value);
              } else {
                setShowNow(moment().hour(10)
                  .minute(0));
              }
            }}
          >
            <Radio.Button value>显示</Radio.Button>
            <Radio.Button value={false}>隐藏</Radio.Button>
            <Radio.Button value="fixed">固定为10点</Radio.Button>
          </Radio.Group>
        </Descriptions.Item>
        <Descriptions.Item label="当前时间颜色">
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
            }}
          />
        </Descriptions.Item>
      </Descriptions>

      <WeeklyCalendar showNow={showNow} showNowColor={color} mode={mode} />
    </div>
  );
};

export default Demo5;
