import { useEventListener, useInterval, useSetState } from 'ahooks';
import type { Moment } from 'moment';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import cn from 'classnames';
import type { WeeklyCalendarDataType } from './def';
import LunarDate from './LunarDate/LunarDate';
import Task from './Task/Task';
import TimeTip from './TimeTip/TimeTip';
import useScheduleData, { hourPercent, schedulePositions } from './useScheduleData';
import useStyles from './WeeklyCalendar.style';

const eArr: unknown[] = [];

const ef = () => {};

const hours = new Array(24).fill(0)
  .map((_, i) => moment().hour(i)
    .minute(0));

export interface WeeklyCalendarProps<T extends WeeklyCalendarDataType = WeeklyCalendarDataType>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'placeholder'> {

  /** 需要显示的日期 */
  current?: moment.Moment;

  /** 日程数据 */
  data?: T[];

  /** 时间精度（分钟） */
  precision?: number;

  /** 选中的数据下标 */
  checked?: number;

  /** 展示模式：周视图/日视图 */
  mode?: 'week' | 'day';

  /** 是否展示当前时间 */
  showNow?: boolean | moment.Moment;

  /** 当前时间的颜色 */
  showNowColor?: string;

  /** 占位日程 */
  placeholder?: WeeklyCalendarDataType;

  /** 渲染占位日程 */
  renderPlaceholder?: (item: { start: moment.Moment; end: moment.Moment }) => React.ReactNode;

  /** 渲染任务数据 */
  children?: (
    item: T & {
      start: moment.Moment;
      end: moment.Moment;
    },
    index: number,
  ) => React.ReactNode;

  /** 任务数据点击事件 */
  onDataClick?: (item: T, index: number) => void;

  /** 空白区域点击事件 */
  onEmptyClick?: (time: moment.Moment) => void;

  /** 左上角时间段的文本 */
  timelineHeader?: string;

  renderHeader?: (element: React.ReactElement, date: Moment, options: { isToday: boolean }) => React.ReactNode;
}

const WeeklyCalendar = <T extends WeeklyCalendarDataType>(props: WeeklyCalendarProps<T>) => {
  const [defaultNow] = useState(() => moment());
  const styles = useStyles();
  const {
    className = '',
    current: _current = defaultNow,
    data = eArr as T[],
    precision = 15,
    children = () => null,
    renderPlaceholder = () => null,
    showNow = true,
    showNowColor = 'red',
    onDataClick = ef,
    onEmptyClick = ef,
    mode = 'week',
    placeholder,
    checked,
    timelineHeader = '时间段',
    renderHeader = a => a,
    ...otherProps
  } = props;

  const current = useMemo(() => _current.clone().second(0)
    .millisecond(0), [_current]);
  const weekMode = mode === 'week';
  const bodyRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const currentWeekday = useMemo(() => current.weekday(), [current]);

  const placeholderMoment = useMemo(
    () =>
      placeholder
        ? {
          start: moment(placeholder.start),
          end: moment(placeholder.end),
        }
        : undefined,
    [placeholder],
  );

  // 占位日程的尺寸
  const placeholderPosition = useMemo(
    () => (placeholderMoment ? schedulePositions(placeholderMoment.start, placeholderMoment.end, current, precision, mode) : undefined),
    [placeholderMoment, current, precision, mode],
  );

  const [hoverIndex, setHoverIndex] = useState(-1);

  /** 记录当前 hover 的日期 */
  const [dayHover, setDayHover] = useSetState({
    day: 0,
    visible: false,
  });

  /** 记录当前 hover 的时间 */
  const [timeHover, setTimeHover] = useSetState({
    time: 0,
    visible: false,
  });

  // 当前时间
  const [nowTime, setNowTime] = useState(() => {
    let now = moment();
    if (moment.isMoment(showNow)) {
      now = showNow;
    }
    return hourPercent(now) / 100;
  });

  useEffect(() => {
    if (moment.isMoment(showNow)) {
      setNowTime(hourPercent(showNow) / 100);
    }
  }, [showNow]);

  // 计时器，用于更新当前时间
  useInterval(
    () => {
      const newNowTime = hourPercent(moment()) / 100;
      if (nowTime !== newNowTime) setNowTime(newNowTime);
    },
    showNow === true ? 1000 : undefined,
    {
      immediate: true,
    },
  );

  const todayStr = useMemo(() => (typeof showNow === 'boolean' ? defaultNow : showNow).format('YYYY-MM-DD'), [showNow]);

  // 计算出这周每天的日期
  const dayListOfWeek = useMemo(() => {
    if (mode === 'day') {
      return [
        {
          day: current.clone(),
          isToday: todayStr === current.format('YYYY-MM-DD'),
        },
      ];
    }
    return [0, 1, 2, 3, 4, 5, 6].map((index) => {
      const day = current.clone().weekday(index);
      return { day, isToday: todayStr === day.format('YYYY-MM-DD') };
    });
  }, [current, mode, todayStr]);

  const {
    // 日程数据的位置信息
    positionInfo,
    // 本周的日程数据
    dataInRange,
  } = useScheduleData<T>({
    current,
    data,
    mode,
    precision,
  });

  useEventListener(
    'click',
    (e) => {
      if (e.target === e.currentTarget) {
        // 点在了空白区域，根据鼠标位置计算出当前点击的时间信息
        onEmptyClick(
          current
            .clone()
            .weekday(dayHover.day)
            .hour(0)
            .minute(0)
            .second(0)
            .add(timeHover.time * 24 * 60, 'minute'),
        );
      }
    },
    { target: viewRef },
  );

  // 监听视图鼠标事件
  useEventListener(
    'mousemove',
    (e: MouseEvent) => {
      const view = viewRef.current;
      if (view) {
        const { top, height } = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const { left, width } = view.getBoundingClientRect();

        const x = e.clientX - left;
        const y = e.clientY - top;
        const day = mode === 'week' ? Math.floor((x / width) * 7) : currentWeekday;
        const time = y / height;
        if (day >= 0) {
          setDayHover({
            day,
            visible: true,
          });
        }

        setTimeHover({
          time,
          visible: true,
        });
      }
    },
    { target: bodyRef },
  );
  useEventListener(
    'mouseleave',
    (e: MouseEvent) => {
      setDayHover({ visible: false });
    },
    { target: viewRef },
  );
  useEventListener(
    'mouseleave',
    (e: MouseEvent) => {
      setTimeHover({ visible: false });
    },
    { target: bodyRef },
  );

  const showNowProps = useMemo(() => {
    if (showNow === false) {
      return {
        visible: false,
      };
    }
    const now = moment.isMoment(showNow) ? showNow : moment();
    const nowDay = now.clone().hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    const currentDay = current.clone().hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    const firstDay = current.clone().weekday(0)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    const dateDiff = nowDay.diff(firstDay, 'day');
    // 不是今天（日视图）或不在本周范围内，则看不见
    if ((mode === 'day' && nowDay.diff(currentDay, 'day') !== 0) || (mode !== 'day' && (dateDiff < 0 || dateDiff > 6))) {
      return {
        visible: false,
      };
    }
    if (mode === 'day') {
      return {
        visible: true,
        lineLeft: 0,
        lineWidth: '100%',
      };
    }
    return {
      visible: true,
      lineLeft: `${(100 * dateDiff) / 7}%`,
      lineWidth: `${100 / 7}%`,
    };
  }, [showNow, current, mode]);

  return (
    <div
      className={cn(
        styles.root,
        {
          [styles.dayMode]: mode === 'day',
          [styles.weekMode]: mode === 'week',
        },
        className,
      )}
      {...otherProps}
    >
      {weekMode && (
        <div className={styles.hoverContainer}>
          {/* hover 的提示 */}
          <div className={cn(styles.hoverDay, { [styles.visible]: dayHover.visible })} style={{ left: `${(dayHover.day * 100) / 7}%` }} />
        </div>
      )}

      {/* 日期标题栏 */}
      <div className={styles.header}>
        {/* 时间段 */}
        <div className={cn(styles.timeline, styles.timelineTitle)}>{timelineHeader}</div>

        {/* 周视图区域(标题部分) */}
        <div className={styles.calendarContainer}>
          {dayListOfWeek.map(({ day, isToday }, index) => (
            <div key={index} className={cn(styles.column, { [styles.today]: isToday })}>
              {renderHeader(
                <>
                  <div className={styles.weekdayName}>{day.format('ddd')}</div>
                  <div className={styles.date}>
                    <div className={styles.dateValue}>{day.date() === 1 ? day.format('MMM') : day.format('DD')}</div>
                    <LunarDate className={styles.lunarDate} year={day.year()} month={day.month() + 1} date={day.date()} format="month-date" />
                  </div>
                </>,
                day,
                { isToday },
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <Scrollbars className={styles.body} autoHide>
        <div ref={bodyRef} className={styles.bodyContent}>
          {/* 时间段 */}
          <div className={styles.timeline}>
            {hours.map((hour, index) => (
              <div key={index} className={styles.hour}>
                <div className={styles.hourTimeline}>{index > 0 ? hour.format('HH:mm') : ''}</div>
              </div>
            ))}
          </div>

          {/* 周视图区域 */}
          <div ref={viewRef} className={styles.calendarContainer}>
            {/* 每小时画格子（后面可能要改 canvas 画 */}
            {dayListOfWeek.map((day, index) => (
              <div key={index} className={styles.column}>
                {hours.map((hour, index) => (
                  <div key={index} className={cn(styles.hour, styles.hourCalendar)} />
                ))}
              </div>
            ))}

            {/* 任务数据} */}
            {dataInRange.map((item, index) => {
              const position = positionInfo.get(item);
              if (!position) return null;
              const { concurrency, order } = position;
              return position.positions.map(position => (
                <Task
                  key={`task_${index}_${position.day}`}
                  className={styles.task}
                  concurrency={concurrency}
                  order={order}
                  position={position}
                  style={{ backgroundColor: item.color }}
                  onClick={() => {
                    onDataClick(item, item._index);
                  }}
                  mode={mode}
                  checked={item._index === checked}
                  hover={item._index === hoverIndex}
                  onMouseEnter={() => {
                    setHoverIndex(item._index);
                  }}
                  onMouseLeave={() => {
                    setHoverIndex(-1);
                  }}
                >
                  {children(item, item._index)}
                </Task>
              ));
            })}

            {/* 占位符 */}
            {placeholderMoment &&
              placeholderPosition?.map((p, index) => (
                <Task key={`placeholder_${index}`} isPlaceholder position={p} mode={mode}>
                  {renderPlaceholder(placeholderMoment)}
                </Task>
              ))}

            {/* 当前时间 */}
            {showNow !== false && <TimeTip time={nowTime} color={showNowColor} textLeft={-60} {...showNowProps} />}
          </div>

          {/* 鼠标 hover 的时间提示 */}
          <TimeTip time={timeHover.time} visible={timeHover.visible} textLeft={20} />
        </div>
      </Scrollbars>
    </div>
  );
};

export default WeeklyCalendar;
