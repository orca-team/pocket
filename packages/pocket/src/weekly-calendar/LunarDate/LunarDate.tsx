import React, { useMemo } from 'react';
import { Solar } from 'lunar-javascript';

export interface LunarDateProps extends React.HTMLAttributes<HTMLDivElement> {
  year: number;
  month: number;
  date: number;
  format?: 'month' | 'date' | 'month-date';
  showJieqi?: boolean;
}

const LunarDate = (props: LunarDateProps) => {
  const { year, month, date, format = 'date', showJieqi = true, ...otherProps } = props;

  const lunar = useMemo(() => Solar.fromYmd(year, month, date).getLunar(), [year, month, date]);

  const content = useMemo(() => {
    const month = `${lunar.getMonthInChinese()}月`;
    const jieqi = lunar.getJieQi();
    let date = lunar.getDayInChinese();

    if (format === 'date') {
      if (date === '初一') date = month;
      return showJieqi ? jieqi || date : date;
    }

    if (format === 'month') {
      return month;
    }

    if (format === 'month-date') {
      return month + date + (showJieqi && jieqi ? `, ${jieqi}` : '');
    }

    return '';
  }, [format, lunar, showJieqi]);

  return <div {...otherProps}>{content}</div>;
};

export default LunarDate;
