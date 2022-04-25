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
