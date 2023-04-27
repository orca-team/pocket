import React, { useMemo } from 'react';
import cn from 'classnames';
import moment from 'moment';
import useStyles from './TimeTip.style';

export interface TimeTipProps extends React.HTMLAttributes<HTMLDivElement> {

  /** 当日时间，请传入百分比，比如 10点 = 10 / 24 */
  time?: number;

  visible?: boolean;

  color?: string;

  textLeft?: string | number;

  lineLeft?: string | number;

  lineWidth?: string | number;
}

const TimeTip = (props: TimeTipProps) => {
  const {
    className = '',
    visible,
    time = 0,
    color = 'var(--weekly-calendar-primary-color)',
    style,
    textLeft,
    lineLeft,
    lineWidth,
    ...otherProps
  } = props;
  const styles = useStyles();

  return (
    <div
      className={cn(styles.root, { [styles.visible]: visible }, className)}
      style={{ ...style, top: `${time * 100}%`, '--color': color }}
      {...otherProps}
    >
      <div className={styles.line} style={{ left: lineLeft, width: lineWidth }} />
      <div className={styles.text} style={{ left: textLeft }}>
        {useMemo(
          () =>
            moment('2000-01-01 00:00:00')
              .add(time * 24 * 60, 'minute')
              .format('HH:mm'),
          [time],
        )}
      </div>
    </div>
  );
};

export default TimeTip;
