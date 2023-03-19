import { createUseStaticCss } from '@orca-fe/tools';

const prefixCls = 'orca-slider';

export default createUseStaticCss(`
.${prefixCls} {
  position: relative;
  width: 100%;
  height: 14px;
  padding: 5px 0;
  border-radius: 6px;
  touch-action: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.${prefixCls} * {
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.${prefixCls}-rail {
  position: absolute;
  width: 100%;
  height: 4px;
  background-color: #e9e9e9;
  border-radius: 6px;
}
.${prefixCls}-track {
  position: absolute;
  height: 4px;
  background-color: #abe2fb;
  border-radius: 6px;
}
.${prefixCls}-handle {
  position: absolute;
  width: 14px;
  height: 14px;
  margin-top: -5px;
  background-color: #fff;
  border: solid 2px #96dbfa;
  border-radius: 50%;
  cursor: pointer;
  cursor: -webkit-grab;
  cursor: grab;
  opacity: 0.8;
  touch-action: pan-x;
}
.${prefixCls}-handle-dragging.${prefixCls}-handle-dragging.${prefixCls}-handle-dragging {
  border-color: #57c5f7;
  box-shadow: 0 0 0 5px #96dbfa;
}
.${prefixCls}-handle:focus {
  outline: none;
  box-shadow: none;
}
.${prefixCls}-handle:focus-visible {
  border-color: #2db7f5;
  box-shadow: 0 0 0 3px #96dbfa;
}
.${prefixCls}-handle-click-focused:focus {
  border-color: #96dbfa;
  box-shadow: unset;
}
.${prefixCls}-handle:hover {
  border-color: #57c5f7;
}
.${prefixCls}-handle:active {
  border-color: #57c5f7;
  box-shadow: 0 0 5px #57c5f7;
  cursor: -webkit-grabbing;
  cursor: grabbing;
}
.${prefixCls}-mark {
  position: absolute;
  top: 18px;
  left: 0;
  width: 100%;
  font-size: 12px;
}
.${prefixCls}-mark-text {
  position: absolute;
  display: inline-block;
  color: #999;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}
.${prefixCls}-mark-text-active {
  color: #666;
}
.${prefixCls}-step {
  position: absolute;
  width: 100%;
  height: 4px;
  background: transparent;
}
.${prefixCls}-dot {
  position: absolute;
  bottom: -2px;
  width: 8px;
  height: 8px;
  vertical-align: middle;
  background-color: #fff;
  border: 2px solid #e9e9e9;
  border-radius: 50%;
  cursor: pointer;
}
.${prefixCls}-dot-active {
  border-color: #96dbfa;
}
.${prefixCls}-dot-reverse {
  margin-right: -4px;
}
.${prefixCls}-disabled {
  background-color: #e9e9e9;
}
.${prefixCls}-disabled .${prefixCls}-track {
  background-color: #ccc;
}
.${prefixCls}-disabled .${prefixCls}-handle,
.${prefixCls}-disabled .${prefixCls}-dot {
  background-color: #fff;
  border-color: #ccc;
  box-shadow: none;
  cursor: not-allowed;
}
.${prefixCls}-disabled .${prefixCls}-mark-text,
.${prefixCls}-disabled .${prefixCls}-dot {
  cursor: not-allowed !important;
}
.${prefixCls}-vertical {
  width: 14px;
  height: 100%;
  padding: 0 5px;
}
.${prefixCls}-vertical .${prefixCls}-rail {
  width: 4px;
  height: 100%;
}
.${prefixCls}-vertical .${prefixCls}-track {
  bottom: 0;
  left: 5px;
  width: 4px;
}
.${prefixCls}-vertical .${prefixCls}-handle {
  margin-top: 0;
  margin-left: -5px;
  touch-action: pan-y;
}
.${prefixCls}-vertical .${prefixCls}-mark {
  top: 0;
  left: 18px;
  height: 100%;
}
.${prefixCls}-vertical .${prefixCls}-step {
  width: 4px;
  height: 100%;
}
.${prefixCls}-vertical .${prefixCls}-dot {
  margin-left: -2px;
}
.rc-slider-tooltip-zoom-down-enter,
.rc-slider-tooltip-zoom-down-appear {
  display: block !important;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-play-state: paused;
}
.rc-slider-tooltip-zoom-down-leave {
  display: block !important;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-play-state: paused;
}
.rc-slider-tooltip-zoom-down-enter.rc-slider-tooltip-zoom-down-enter-active,
.rc-slider-tooltip-zoom-down-appear.rc-slider-tooltip-zoom-down-appear-active {
  animation-name: rcSliderTooltipZoomDownIn;
  animation-play-state: running;
}
.rc-slider-tooltip-zoom-down-leave.rc-slider-tooltip-zoom-down-leave-active {
  animation-name: rcSliderTooltipZoomDownOut;
  animation-play-state: running;
}
.rc-slider-tooltip-zoom-down-enter,
.rc-slider-tooltip-zoom-down-appear {
  transform: scale(0, 0);
  animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}
.rc-slider-tooltip-zoom-down-leave {
  animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
}
@keyframes rcSliderTooltipZoomDownIn {
  0% {
    transform: scale(0, 0);
    transform-origin: 50% 100%;
    opacity: 0;
  }
  100% {
    transform: scale(1, 1);
    transform-origin: 50% 100%;
  }
}
@keyframes rcSliderTooltipZoomDownOut {
  0% {
    transform: scale(1, 1);
    transform-origin: 50% 100%;
  }
  100% {
    transform: scale(0, 0);
    transform-origin: 50% 100%;
    opacity: 0;
  }
}
.${prefixCls}-tooltip {
  position: absolute;
  top: -9999px;
  left: -9999px;
  visibility: visible;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.${prefixCls}-tooltip * {
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.${prefixCls}-tooltip-hidden {
  display: none;
}
.${prefixCls}-tooltip-placement-top {
  padding: 4px 0 8px 0;
}
.${prefixCls}-tooltip-inner {
  min-width: 24px;
  height: 24px;
  padding: 6px 2px;
  color: #fff;
  font-size: 12px;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  background-color: #6c6c6c;
  border-radius: 6px;
  box-shadow: 0 0 4px #d9d9d9;
}
.${prefixCls}-tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}
.${prefixCls}-tooltip-placement-top .${prefixCls}-tooltip-arrow {
  bottom: 4px;
  left: 50%;
  margin-left: -4px;
  border-width: 4px 4px 0;
  border-top-color: #6c6c6c;
}


`);
