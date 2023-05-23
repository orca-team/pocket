import React from 'react';
import cn from 'classnames';
import type { VirtualCalendarProps, VirtualCalendarRefType } from './VirtualCalendar';
import VirtualCalendar from './VirtualCalendar';
import useStyles from './CardCalendar.style';

export interface CardCalendarProps extends Omit<VirtualCalendarProps, 'checkable'> {

  /** 选择模式： 按周/日选择 */
  checkMode?: 'week' | 'day' | false;
}

const CardCalendar = React.forwardRef<VirtualCalendarRefType, CardCalendarProps>((props: CardCalendarProps, ref) => {
  const {
    className = '',
    rowHeight = 36,
    weekHeaderFormat = 'dd',
    checkMode = 'day',
    monthFormat = 'YYYY年MM月',
    children = () => undefined,
    ...otherProps
  } = props;
  const styles = useStyles();

  return (
    <VirtualCalendar
      ref={ref}
      className={cn(
        styles.root,
        {
          [styles.checkModeWeek]: checkMode === 'week',
          [styles.checkModeDay]: checkMode === 'day',
          [styles.checkable]: !!checkMode,
        },
        className,
      )}
      rowHeight={rowHeight}
      monthFormat={monthFormat}
      weekHeaderFormat={weekHeaderFormat}
      today={false}
      {...otherProps}
      checkable={!!checkMode}
    >
      {(date, params) => {
        const element = children(date, params);
        return (
          <div className={styles.date}>
            {element || (
              <div className={styles.dateStr}>
                <div style={{ position: 'relative' }}>{date.date()}</div>
              </div>
            )}
          </div>
        );
      }}
    </VirtualCalendar>
  );
});

export default CardCalendar;
