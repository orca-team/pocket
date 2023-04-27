import { floorBy, roundBy } from '@orca-fe/tools';
import moment from 'moment';
import { useMemo } from 'react';
import type { DataPositionInfoType, DataPositionType, WeeklyCalendarDataType } from './def';

export type UseScheduleDataOptions<T> = {

  /** 当前视图所包含的日期 */
  current: moment.Moment;

  /** 展示模式：周视图/日视图 */
  mode: 'week' | 'day';

  /** 日程数据 */
  data: T[];

  /** 时间精度（分钟） */
  precision: number;
};

export function hourPercent(m: moment.Moment) {
  return (100 * (m.hour() * 60 + m.minute())) / (24 * 60);
}

function createIsInRange(current: moment.Moment, range: 'week' | 'day') {
  // 起始日期
  const startDate = current.clone().hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  // 结束日期
  const endDate = current.clone().hour(23)
    .minute(59)
    .second(59)
    .millisecond(999);

  if (range === 'week') {
    startDate.weekday(0);
    endDate.weekday(6);
  }

  // 日期是否处于范围内
  const isInRange = (start: moment.Moment, end: moment.Moment) => {
    // 起始日期比结束范围要晚
    if (moment(start).diff(endDate) > 0) {
      return false;
    }
    // 结束日期比起始范围要早
    if (moment(end).diff(startDate) < 0) {
      return false;
    }
    return true;
  };
  return { isInRange, startDate, endDate };
}

function zeroOClock(m: moment.MomentInput) {
  return moment(m).clone()
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
}

/**
 * 根据日程的起止时间，计算日程的位置信息
 */
export function schedulePositions(start: moment.Moment, end: moment.Moment, current: moment.Moment, precision: number, mode: 'week' | 'day') {
  const positions: DataPositionType[] = [];
  const currentDate = zeroOClock(current);
  const currentWeekday = current.weekday();
  const startWeekday = currentWeekday + zeroOClock(start).diff(currentDate, 'day');
  const endWeekday = currentWeekday + zeroOClock(end).diff(currentDate, 'day');
  const floor = floorBy(precision);
  const round = roundBy(precision);

  for (let i = 0; i <= endWeekday - startWeekday; i++) {
    if (mode === 'day' && i + startWeekday !== currentWeekday) {
      continue;
    }
    // 针对结束时间是0点的跨天日程情况，将不在最后一天生成位置信息
    if (i === endWeekday && endWeekday !== startWeekday && end.format('HH:mm:ss') === '00:00:00') {
      continue;
    }

    const startTime = floor(start.toDate().getTime());
    const startPercent = i === 0 ? hourPercent(moment(startTime)) : 0;
    let endTime = round(end.toDate().getTime());
    // 结束时间取四舍五入，如果结束时间四舍五入后和
    if (endTime <= startTime) endTime += precision;
    const endPercent = i + startWeekday === endWeekday ? hourPercent(moment(endTime)) : 100;

    positions.push({
      day: startWeekday + i,
      startPercent,
      endPercent,
    });
  }
  return positions;
}

/**
 * 根据当前日期、原始日程数据、时间精度等配置，处理日程数据
 * 将会得到本周/本日的日程数据及日程在视图中的位置信息
 */
export default function useScheduleData<T extends WeeklyCalendarDataType>(options: UseScheduleDataOptions<T>) {
  type MomentDataType = T & {
    start: moment.Moment;
    end: moment.Moment;
    _index: number;
  };

  const { current, data, precision, mode } = options;

  // 获得任务的并发信息
  const { positionInfo, dataInRange } = useMemo(() => {
    const percisionTimestamp = precision * 60 * 1000;
    const floor = floorBy(percisionTimestamp);
    const round = roundBy(percisionTimestamp);
    // 判断某日期是否处于本周范围
    const { isInRange, endDate, startDate } = createIsInRange(current, mode);
    // 筛选出本周的数据
    const dataInRange = data
      .map((item, index) => ({
        ...item,
        start: moment(item.start),
        end: moment(item.end),
        _index: index,
      }))
      .filter((item) => {
        const r = isInRange(item.start, item.end);
        // if (!r) {
        //   console.log(
        //     'out',
        //     item['title'],
        //     item.start.format('MM-DD HH:mm'),
        //     item.end.format('MM-DD HH:mm'),
        //   );
        // }
        return r;
      });

    const startCache: Record<number, Set<MomentDataType> | undefined> = {};
    const endCache: Record<number, Set<MomentDataType> | undefined> = {};
    // 遍历的起始时间点
    let startTimestamp = floor(startDate.toDate().getTime());
    // 遍历的结束时间点
    const endTimestamp = round(endDate.toDate().getTime());
    // 生成起始、结束时间缓存
    dataInRange.forEach((item) => {
      const startTime = floor(item.start.toDate().getTime());
      startTimestamp = Math.min(startTimestamp, startTime);
      let endTime = round(item.end.toDate().getTime());
      if (endTime <= startTime) endTime += percisionTimestamp;
      if (!startCache[startTime]) startCache[startTime] = new Set();
      if (!endCache[endTime]) endCache[endTime] = new Set();
      startCache[startTime]?.add(item);
      endCache[endTime]?.add(item);
    });

    // 开始遍历数据，生成位置信息
    const positionInfo = new Map<T, DataPositionInfoType>();
    let count = 0;
    let arr: (MomentDataType | undefined)[] = [];
    let history: MomentDataType[] = [];
    for (let t = startTimestamp; t <= endTimestamp; t += percisionTimestamp) {
      let changed = false;
      const startDataList = [...(startCache[t] || [])];
      const endDataSet = endCache[t];
      if (endDataSet) {
        changed = true;
        arr = arr.map((item) => {
          if (item && endDataSet.has(item)) {
            count -= 1;
            history.push(item);
            return undefined;
          }
          return item;
        });
      }
      if (count === 0) {
        arr = [];
        history = [];
      }

      if (startDataList.length > 0) {
        changed = true;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == null) {
            const item = startDataList.shift();
            if (item) {
              if (endDataSet?.has(item)) continue;
              arr[i] = item;
              count += 1;
            }
          }
          if (startDataList.length <= 0) break;
        }

        startDataList.forEach((item) => {
          if (endDataSet?.has(item)) return;
          count += 1;
          arr.push(item);
        });
      }

      if (changed) {
        // console.log(
        //   moment(t).format('YYYY-MM-DD HH:mm'),
        //   arr.map(item => item?.['title'] || 'null').join(', '),
        // );
        [...arr, ...history].forEach((item, order) => {
          if (item) {
            const o = positionInfo.get(item) || {
              concurrency: 0,
              order,
              positions: [],
            };
            // 任务并发数
            o.concurrency = Math.max(o.concurrency, arr.length);
            // 生成位置信息
            if (o.positions.length === 0) {
              o.positions.push(...schedulePositions(item.start, item.end, current, percisionTimestamp, mode));
            }
            positionInfo.set(item, o);
          }
        });
      }
    }

    return { positionInfo, dataInRange };
  }, [current, data, precision, mode]);

  return {
    positionInfo,
    dataInRange,
  };
}
