import React from 'react';
import type { TooltipProps as RcTooltipProps } from 'rc-tooltip/es/Tooltip';
import RcTooltip from 'rc-tooltip';
import useStyles from './Tooltip.style';

export interface TooltipProps extends RcTooltipProps {}

const Tooltip: React.FC<TooltipProps> = (props) => {
  const { motion, ...otherProps } = props;
  useStyles();
  return (
    <RcTooltip
      mouseEnterDelay={0}
      mouseLeaveDelay={0.1}
      prefixCls="orca-tooltip"
      motion={{ motionName: 'orca-tooltip-zoom', ...motion }}
      {...otherProps}
    />
  );
};

export default Tooltip;
