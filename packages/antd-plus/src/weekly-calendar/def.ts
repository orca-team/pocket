import type moment from 'moment';

export type DataPositionType = {
  day: number;
  startPercent: number;
  endPercent: number;
};

/** 组件数据位置信息 */
export type DataPositionInfoType = {
  concurrency: number;
  order: number;
  positions: DataPositionType[];
};

export type WeeklyCalendarDataType = {
  start: moment.MomentInput;
  end: moment.MomentInput;
  color?: string;
};
