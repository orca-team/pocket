import lunar from 'lunar-javascript';
import type moment from 'moment';
import cn from 'classnames';
import React, { useMemo } from 'react';
import type { CustomDateRenderType } from '../Context';
import useStyles from './DateCell.style';

const { Solar } = lunar;

const ef = () => undefined;

export interface DateCellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  date: moment.Moment;
  checked?: boolean;
  isToday?: boolean;
  isCurrentMonth?: boolean;

  /** 自定义日期渲染 */
  children?: CustomDateRenderType;
}

const DateCell = (props: DateCellProps) => {
  const { className = '', date, checked, isToday, isCurrentMonth, children = ef, ...otherProps } = props;
  const styles = useStyles();
  const lunarStr = useMemo(() => {
    const lunar = Solar.fromYmd(date.year(), date.month() + 1, date.date()).getLunar();
    const month = `${lunar.getMonthInChinese()}月`;
    const lunarStr: string = lunar.getJieQi() || lunar.getJieQi() || lunar.getDayInChinese();
    return lunarStr === '初一' ? month : lunarStr;
  }, [date]);

  const element = children(date, { lunar: lunarStr });

  return (
    <div
      className={`${cn(styles.root, {
        [styles.today]: isToday,
        [styles.checked]: checked,
        [styles.currentMonth]: isCurrentMonth,
      })} ${className}`}
      {...otherProps}
    >
      {element || (
        <div className={styles.date}>
          <div className={styles.text}>{date.format('DD')}</div>
          <div className={styles.extra}>{lunarStr}</div>
        </div>
      )}
    </div>
  );
};

export default React.memo(DateCell);
