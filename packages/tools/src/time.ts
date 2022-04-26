import moment from 'moment';

/**
 * 对时间进行更友好的展示
 * @param input 需要进行转换的时间
 * @param now 对比的时间，默认为当前时间
 */
export function smartDateFromNow(
  input: moment.MomentInput,
  nowInput: moment.MomentInput = undefined,
) {
  const now = moment(nowInput);
  const yearDiff = now.diff(input, 'year');
  if (yearDiff > 0) return `${yearDiff} 年前`;
  const monthDiff = now.diff(input, 'month');
  if (monthDiff > 0) return `${monthDiff} 个月前`;
  const dayDiff = now.diff(input, 'day');
  if (dayDiff > 0) return `${dayDiff} 天前`;
  const hourDiff = now.diff(input, 'hour');
  if (hourDiff > 0) return `${hourDiff} 小时前`;
  const minute = now.diff(input, 'minute');
  if (minute > 0) return `${minute} 分钟前`;
  return '刚刚';
}

// 时间范围相关工具
export type DateRange = { start?: moment.Moment; end?: moment.Moment };

export type DateRangeStrType =
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'season'
  | 'year';

export function endOfDay(todayInput: moment.MomentInput = undefined) {
  const today = moment(todayInput);
  return today.hour(23).minute(59).second(59).millisecond(999);
}

/**
 * 获得一个时间范围
 * @param type 范围类型
 */
export function getDateRange(
  type: DateRangeStrType,
  todayInput: moment.MomentInput = undefined,
): DateRange {
  const now = moment(todayInput);
  const startDay = now.clone().hour(0).minute(0).second(0).millisecond(0);
  let range: DateRange;
  switch (type) {
    case 'minute':
      range = {
        start: now.clone().second(0).millisecond(0),
        end: now.clone().second(59).millisecond(999),
      };
      break;
    case 'hour':
      range = {
        start: now.clone().minute(0).second(0).millisecond(0),
        end: now.clone().minute(59).second(59).millisecond(999),
      };
      break;
    case 'day':
      range = { start: startDay, end: endOfDay(startDay) };
      break;
    case 'week': {
      const start = startDay.add(-1 * now.day() + 1, 'day');
      range = {
        start,
        end: endOfDay(start.clone().add(6, 'day')),
      }; // 从周一开始
      break;
    }
    case 'month': {
      // 从本月第一天开始
      const start = startDay.add(-1 * now.date() + 1, 'day');
      range = {
        start,
        end: endOfDay(start.clone().add(1, 'month').add(-1, 'day')),
      };
      break;
    }
    case 'season': {
      // month % 3 计算季度第一个月
      const month = now.month();
      const start = startDay.month(month - (month % 3)).date(1);
      range = {
        start,
        end: endOfDay(start.clone().add(3, 'month').add(-1, 'day')),
      };
      break;
    }
    case 'year': {
      const start = startDay.month(0).date(1);
      range = {
        start,
        end: endOfDay(start.clone().add(1, 'year').add(-1, 'day')),
      };
      break;
    }
    default:
      range = { start: undefined, end: undefined };
      break;
  }
  return range;
}
