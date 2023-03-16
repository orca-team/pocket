import React from 'react';
import type { TriggerProps as RcTriggerProps } from '@rc-component/trigger';
import RcTrigger from '@rc-component/trigger';
import useStyles from './Trigger.style';

export interface TriggerProps extends RcTriggerProps {}

const Trigger: React.FC<TriggerProps> = (props) => {
  const { popupMotion, ...otherProps } = props;
  useStyles();
  return (
    <RcTrigger
      action="hover"
      popupAlign={{
        points: ['tl', 'bl'],
        offset: [0, 3],
      }}
      prefixCls="orca-trigger"
      popupMotion={{
        motionName: 'orca-trigger-zoom',
        ...popupMotion,
      }}
      {...otherProps}
    />
  );
};

export default Trigger;
