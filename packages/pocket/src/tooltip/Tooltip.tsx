import React from 'react';
import type { TooltipProps as RcTooltipProps } from 'rc-tooltip/es/Tooltip';
import RcTooltip from 'rc-tooltip';
import useStyles from './Tooltip.style';

export interface TooltipProps extends RcTooltipProps {}

const Tooltip = React.forwardRef<any, TooltipProps>((props, pRef) => {
  const { motion, ...otherProps } = props;
  useStyles();
  return (
    <RcTooltip
      ref={pRef}
      mouseEnterDelay={0}
      mouseLeaveDelay={0.1}
      prefixCls="orca-tooltip"
      motion={{ motionName: 'orca-tooltip-zoom', ...motion }}
      {...otherProps}
    />
  );
});

export default Tooltip;
