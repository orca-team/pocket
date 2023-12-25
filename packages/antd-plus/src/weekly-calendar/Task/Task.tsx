import type { CSSProperties } from 'react';
import React from 'react';
import cn from 'classnames';
import type { DataPositionType } from '../def';
import useStyles from './Task.style';

export interface TaskProps extends React.HTMLAttributes<HTMLDivElement> {
  // 位置信息
  position: DataPositionType;
  concurrency?: number;
  order?: number;
  mode: 'week' | 'day';
  // 是否选中
  checked?: boolean;
  // 是否 hover
  hover?: boolean;
  // 是否占位日程
  isPlaceholder?: boolean;
}

/**
 * 任务块组件（用于根据任务的位置信息，生成样式）
 */
const Task = (props: TaskProps) => {
  const { className = '', position, concurrency = 1, order = 0, style, mode, checked, hover, isPlaceholder, ...otherProps } = props;
  const styles = useStyles();

  const { day: _day, endPercent, startPercent } = position;
  const length = mode === 'week' ? 7 : 1;
  const day = mode === 'week' ? _day : 0;
  return (
    <div
      className={`${cn(styles.root, {
        [styles.hover]: hover,
        [styles.checked]: checked,
        [styles.placeholder]: isPlaceholder,
      })} ${className}`}
      style={
        {
          ...style,
          left: `calc(${(100 * (day + order / concurrency)) / length}% + 1px)`,
          width: `calc(${100 / length / concurrency}% - 3px)`,
          top: `calc(${startPercent}% + 1px)`,
          height: `calc(${endPercent - startPercent}% - 2px)`,
          display: endPercent === startPercent ? 'none' : '',
          '--day': _day,
          '--col-left': `calc(${(100 * day) / length}% + 1px)`,
          '--col-width': `calc(${100 / length}% - 3px)`,
        } as CSSProperties
      }
      {...otherProps}
    />
  );
};

export default Task;
