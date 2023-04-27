import React, { useContext, useMemo } from 'react';
import cn from 'classnames';
import VirtualCalendarContext from '../Context';
import DateCell from '../DateCell';
import useStyles from './Week.style';

const ef = () => {};

export interface WeekProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: unknown;

  /** 距离起始日期第几周 */
  index: number;

  isScrolling?: boolean;
}

const Week = (props: WeekProps) => {
  const { className = '', data, index, isScrolling, ...otherProps } = props;
  const styles = useStyles();
  const { currentMonth, startDate, today, checked, onDateClick = ef, customDateRender } = useContext(VirtualCalendarContext);
  const checkedStr = useMemo(() => (checked ? checked.format('YYYY-MM-DD') : ''), [checked]);

  const { dateList, hasChecked } = useMemo(() => {
    const currentWeek = startDate.clone().add(index, 'week');
    let hasChecked = false;
    const dateList = [0, 1, 2, 3, 4, 5, 6].map((i) => {
      const date = currentWeek.clone().weekday(i);
      const dateStr = date.format('YYYY-MM-DD');
      const isToday = dateStr === today;
      const isChecked = dateStr === checkedStr;
      const isCurrentMonth = date.format('YYYY-MM') === currentMonth;
      if (isChecked) {
        hasChecked = true;
      }
      return {
        date,
        isToday,
        isCurrentMonth,
        isChecked,
      };
    });
    return { dateList, hasChecked };
  }, [startDate, index, currentMonth, today, checkedStr]);

  return (
    <div className={`${cn(styles.root, { [styles.checked]: hasChecked })} ${className}`} {...otherProps}>
      {dateList.map(({ date, isCurrentMonth, isToday, isChecked }, index) => (
        <DateCell
          key={index}
          className={styles.date}
          date={date}
          isToday={isToday}
          checked={isChecked}
          isCurrentMonth={isCurrentMonth}
          onClick={() => {
            onDateClick(date);
          }}
        >
          {customDateRender}
        </DateCell>
      ))}
    </div>
  );
};

export default Week;
