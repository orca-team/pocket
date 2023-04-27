import type { Moment } from 'moment';
import moment from 'moment';
import React from 'react';

export type CustomDateRenderType = (date: Moment, params: { lunar: string }) => React.ReactElement | undefined;

export type VirtualCalendarContextType = {
  currentMonth: string;
  today: string;
  startDate: moment.Moment;
  checked?: moment.Moment;
  rowHeight: number;
  onDateClick?: (date: Moment) => void;
  customDateRender?: CustomDateRenderType;
};

const VirtualCalendarContext = React.createContext<VirtualCalendarContextType>({
  currentMonth: '',
  today: '',
  startDate: moment(),
  rowHeight: 100,
});

export default VirtualCalendarContext;
