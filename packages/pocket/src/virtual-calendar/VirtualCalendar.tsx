import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { useDebounceFn, useMemoizedFn, useSize } from 'ahooks';
import type { Moment, MomentInput } from 'moment';
import moment from 'moment';
import cn from 'classnames';
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';
import type { CustomDateRenderType } from './Context';
import VirtualCalendarContext from './Context';
import Week from './Week';
import useStyles from './VirtualCalendar.style';

const ef = () => undefined;

export type VirtualCalendarRefType = {
  scrollTo(date: MomentInput): void;
};

export interface VirtualCalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {

  /** 日历能展示的最早的日期 */
  startDate?: Moment;

  /** 日历能展示的最晚的日期 */
  endDate?: Moment;

  /** 行高，当选择 'auto' 时，将会自动根据容器高度划分为 6 行 */
  rowHeight?: number | 'auto';

  /** 默认展示的月份，默认为本月 */
  defaultCurrentMonth?: MomentInput;

  /** 今天的日期 */
  today?: MomentInput | boolean;

  /** 选中的日期 */
  checked?: MomentInput;

  /** 日期是否可被選中 */
  checkable?: boolean;

  /** 日期点击事件 */
  onDateClick?: (date: Moment) => void;

  /** 月份变化事件 */
  onCurrentMonthChange?: (month: string) => void;

  /** 因为虚拟日历组件是无线滚动的，为了避免频繁触发月份变化事件，这里增加触发防抖 */
  monthChangeDebounce?: number;

  /** 顶部日期展示的格式 */
  monthFormat?: string;

  /** 周格式 */
  weekHeaderFormat?: string;

  /** 自定义日期渲染 */
  children?: CustomDateRenderType;

  /** 上翻页箭头 */
  arrowUp?: React.ReactNode;

  /** 下翻页箭头 */
  arrowDown?: React.ReactNode;
}

const VirtualCalendar = React.forwardRef<VirtualCalendarRefType, VirtualCalendarProps>((props, ref) => {
  const [{ defaultEndDate, defaultStartDate }] = useState(() => ({
    defaultStartDate: moment('2010-01-01 00:00:00'),
    defaultEndDate: moment('2030-01-01 00:00:00'),
  }));
  const styles = useStyles();

  const [now] = useState(() => moment());

  const {
    className = '',
    rowHeight: _rowHeight = 'auto',
    startDate: _startDate = defaultStartDate,
    endDate: _endDate = defaultEndDate,
    defaultCurrentMonth = now,
    today: _today,
    checked: _checked,
    monthFormat = 'YYYY-MM',
    weekHeaderFormat = 'ddd',
    checkable = true,
    onDateClick = ef,
    onCurrentMonthChange = ef,
    monthChangeDebounce = 300,
    arrowDown = <CaretDownOutlined />,
    arrowUp = <CaretUpOutlined />,
    children = ef,
    ...otherProps
  } = props;

  const showToday = _today !== false;
  const listRef = useRef<FixedSizeList>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const { width, height } = useSize(bodyRef) || { width: 0, height: 0 };
  const rowHeight = _rowHeight === 'auto' ? height / 6 : _rowHeight;
  if (height > 0 && rowHeight > 0 && !initRef.current) initRef.current = true;

  const weekHeader = useMemo(
    () => Array.from(Array(7).keys()).map((_, index) => moment().weekday(index)
      .format(weekHeaderFormat)),
    [weekHeaderFormat],
  );

  const [centerTop, setCenterTop] = useState(0);

  const { endDate, startDate } = useMemo(() => {
    const startDate = _startDate.clone().weekday(0);
    const endDate = _endDate.clone().weekday(6);
    return { startDate, endDate };
  }, [_startDate, _endDate]);

  const allWeekList = useMemo(() => Array.from(Array(Math.ceil(endDate.diff(startDate, 'week'))).keys()), [startDate, endDate]);

  // 计算出当前的月份
  const currentMonth = useMemo(() => {
    const centerWeek = Math.floor(centerTop / rowHeight);
    const centerMonth = startDate.clone().add(centerWeek, 'week');
    return centerMonth;
  }, [rowHeight, centerTop, startDate]);

  const currentMonthStr = useMemo(() => currentMonth.format('YYYY-MM'), [currentMonth]);
  const monthFormatStr = useMemo(() => currentMonth.format(monthFormat), [currentMonth, monthFormat]);

  const onCurrentMonthChangeDebounce = useDebounceFn(onCurrentMonthChange, {
    wait: monthChangeDebounce,
  });

  useEffect(() => {
    onCurrentMonthChangeDebounce.run(currentMonthStr);
  }, [currentMonthStr]);

  const today = useMemo(() => {
    if (typeof _today === 'boolean') {
      return now;
    }
    return moment(_today);
  }, [_today]);
  const todayStr = useMemo(() => today.format('YYYY-MM-DD'), [today]);
  const checked = useMemo(() => (_checked ? moment(_checked) : undefined), [_checked]);

  const debounceCallback = useDebounceFn(
    (callback: () => void) => {
      callback();
    },
    { wait: 30 },
  );

  const scrollTo = useMemoizedFn((month: MomentInput, anim = true) => {
    onCurrentMonthChangeDebounce.cancel();
    debounceCallback.cancel();
    const target = moment(month);
    const week = target.diff(startDate, 'week');
    if (outerRef.current) {
      const scrollTop = week * rowHeight;
      if (anim) {
        outerRef.current.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      } else {
        outerRef.current.scrollTop = scrollTop;
        debounceCallback.run(() => {
          // check scrollHeight
          if (outerRef.current && Math.trunc(outerRef.current.scrollTop) !== Math.trunc(scrollTop)) {
            scrollTo(month, anim);
          }
        });
      }
    } else if (listRef.current) {
      listRef.current.scrollTo(week * rowHeight);
    }
  });

  useImperativeHandle(ref, () => ({ scrollTo }));

  useEffect(() => {
    if (initRef.current && defaultCurrentMonth) {
      scrollTo(moment(defaultCurrentMonth).date(1), false);
    }
  }, [initRef.current]);

  const handleDateClick = useMemoizedFn(onDateClick);
  const customDateRender = useMemoizedFn(children);

  return (
    <VirtualCalendarContext.Provider
      value={useMemo(
        () => ({
          currentMonth: currentMonthStr,
          startDate,
          today: todayStr,
          rowHeight,
          checked,
          onDateClick: handleDateClick,
          customDateRender,
        }),
        [currentMonthStr, startDate, todayStr, rowHeight, checked],
      )}
    >
      <div
        className={`${cn(styles.root, {
          [styles.showToday]: showToday,
          [styles.checkable]: checkable,
        })} ${className}`}
        {...otherProps}
      >
        {/* 日历背景日期 */}
        <div className={styles.backgroundMonth}>{monthFormatStr}</div>
        {/* 日历工具栏 */}
        <div className={styles.toolbar}>
          <div className={styles.parentValue}>{monthFormatStr}</div>
          <div style={{ flex: 1 }} />
          <div
            className={styles.button}
            onClick={() => {
              scrollTo(currentMonth.clone().add(-1, 'month')
                .date(1));
            }}
          >
            {arrowUp}
          </div>
          <div
            className={styles.button}
            onClick={() => {
              scrollTo(currentMonth.clone().add(1, 'month')
                .date(1));
            }}
          >
            {arrowDown}
          </div>
        </div>
        {/* 日历头部 */}
        <div className={styles.header}>
          {weekHeader.map(str => (
            <div key={str} className={styles.headerItem}>
              {str}
            </div>
          ))}
        </div>
        {/* 日期本体 */}
        <div ref={bodyRef} className={styles.body}>
          {height && rowHeight && (
            <FixedSizeList
              ref={listRef}
              outerRef={outerRef}
              className={styles.virtualList}
              width={width}
              height={height}
              itemSize={rowHeight}
              itemCount={allWeekList.length}
              onScroll={(options) => {
                const { scrollOffset } = options;
                const targetCenterTop = scrollOffset + 0.5 * height;
                if (Math.abs(targetCenterTop - centerTop) > rowHeight) {
                  setCenterTop(targetCenterTop);
                }
              }}
            >
              {Week}
            </FixedSizeList>
          )}
        </div>
      </div>
    </VirtualCalendarContext.Provider>
  );
});

export const useCalendarRef = () => useRef<VirtualCalendarRefType>(null);

export default VirtualCalendar;
