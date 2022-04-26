---
title: DateTime 日期相关
nav:
  title: Tools
  path: /tools
group:
  title: 基础工具
  path: /base
---

# DateTime 时间相关工具集

## smartDateFromNow 友好的日期显示

```ts
/**
 * 格式化并友好的日期显示
 * @param input 需要格式化的时间
 * @param nowInput 指定对比的时间，默认为当前时间
 */
function smartDateFromNow(
  input: moment.MomentInput,
  nowInput?: moment.MomentInput,
): string;
```

```tsx
import React from 'react';
import moment from 'moment';
import { smartDateFromNow } from '@orca-fe/tools';

export default () => (
  <div>
    <ol>
      {[
        moment().add(-10, 'second').format('YYYY-MM-DD HH:mm:ss'),
        moment().add(-2, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        moment().add(-4, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        moment().add(-1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        moment().add(-50, 'day').format('YYYY-MM-DD HH:mm:ss'),
        moment().add(-200, 'day').format('YYYY-MM-DD HH:mm:ss'),
        '2020-01-20',
        '2005-12-30',
        '1992-02-14',
      ].map((text, index) => (
        <li key={index}>
          {text}({smartDateFromNow(text)})
        </li>
      ))}
    </ol>
  </div>
);
```

## getDateRange 获取范围

```ts
type DateRange = { start?: moment.Moment; end?: moment.Moment };
type DateRangeStrType =
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'season'
  | 'year';

/**
 * 获取时间范围
 * @param type 范围类型 分钟，小时，日，周，季度，年
 * @param todayInput 指定范围依据的时间，默认为当前时间
 */
function getDateRange(
  type: DateRangeStrType,
  todayInput?: moment.MomentInput,
): DateRange;
```

```tsx
import React from 'react';
import moment from 'moment';
import { getDateRange, DateRange } from '@orca-fe/tools';

function formatRange(range: DateRange) {
  return `${range.start?.format('YYYY-MM-DD HH:mm:ss')} ~ ${range.end?.format(
    'YYYY-MM-DD HH:mm:ss',
  )}`;
}

export default () => (
  <div>
    <ol>
      <li>当前的分钟范围：{formatRange(getDateRange('minute'))}</li>
      <li>当前的小时范围：{formatRange(getDateRange('hour'))}</li>
      <li>今日范围：{formatRange(getDateRange('day'))}</li>
      <li>本月范围：{formatRange(getDateRange('month'))}</li>
      <li>本季范围：{formatRange(getDateRange('season'))}</li>
      <li>本年范围：{formatRange(getDateRange('year'))}</li>
      <li>
        查找 2015-07-01 的日范围：
        {formatRange(getDateRange('day', '2015-07-01'))}
      </li>
      <li>
        查找 2000-02-14 所在的月范围：
        {formatRange(getDateRange('month', '2000-02-14'))}
      </li>
      <li>
        查找 2012-12-25 所在的季范围：
        {formatRange(getDateRange('season', '2012-12-25'))}
      </li>
    </ol>
  </div>
);
```
