import React, { useRef } from 'react';
import type { SliderProps as RcSliderProps } from 'rc-slider';
import RcSlider from 'rc-slider';
import { useMergedRefs } from '@orca-fe/hooks';
import { useRafInterval } from 'ahooks';
import useStyles from './Slider.style';
import type { TooltipProps } from '../tooltip';
import Tooltip from '../tooltip';

const AutoAlignTooltip = React.forwardRef<any, TooltipProps>((props, pRef) => {
  const { visible } = props;
  const tooltipRef = useRef<any>(null);
  const mergedRefs = useMergedRefs(pRef, tooltipRef);

  useRafInterval(
    () => {
      const tooltip = tooltipRef.current;
      if (tooltip) {
        tooltip.forcePopupAlign();
      }
    },
    visible ? 16 : undefined,
  );

  return <Tooltip ref={mergedRefs} {...props} />;
});

export interface SliderProps extends RcSliderProps {}

const Slider: React.FC<SliderProps> = (props) => {
  const { ...otherProps } = props;
  useStyles();
  return (
    <RcSlider
      prefixCls="orca-slider"
      handleRender={(node, handleProps) => (
        <AutoAlignTooltip
          overlay={handleProps.value}
          placement="top"
          visible={handleProps.dragging}
        >
          {node}
        </AutoAlignTooltip>
      )}
      {...otherProps}
    />
  );
};

export default Slider;
