import { createUseStaticCss } from '@orca-fe/tools';

const prefixCls = 'orca-tooltip';

export default createUseStaticCss(`
.${prefixCls}.${prefixCls}-zoom-appear,
.${prefixCls}.${prefixCls}-zoom-enter {
  opacity: 0;
}
.${prefixCls}.${prefixCls}-zoom-enter,
.${prefixCls}.${prefixCls}-zoom-leave {
  display: block;
}
.${prefixCls}-zoom-enter,
.${prefixCls}-zoom-appear {
  opacity: 0;
  animation-duration: 0.2s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
  animation-play-state: paused;
}
.${prefixCls}-zoom-leave {
  animation-duration: 0.2s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.6, -0.3, 0.74, 0.05);
  animation-play-state: paused;
}
.${prefixCls}-zoom-enter.${prefixCls}-zoom-enter-active,
.${prefixCls}-zoom-appear.${prefixCls}-zoom-appear-active {
  animation-name: rcToolTipZoomIn;
  animation-play-state: running;
}
.${prefixCls}-zoom-leave.${prefixCls}-zoom-leave-active {
  animation-name: rcToolTipZoomOut;
  animation-play-state: running;
}
@keyframes rcToolTipZoomIn {
  0% {
    opacity: 0;
    transform-origin: 50% 50%;
    transform: scale(0.8, 0.8);
  }
  100% {
    opacity: 1;
    transform-origin: 50% 50%;
    transform: scale(1, 1);
  }
}
@keyframes rcToolTipZoomOut {
  0% {
    opacity: 1;
    transform-origin: 50% 50%;
    transform: scale(1, 1);
  }
  100% {
    opacity: 0;
    transform-origin: 50% 50%;
    transform: scale(0.8, 0.8);
  }
}
.${prefixCls} {
  position: absolute;
  z-index: 1070;
  display: block;
  visibility: visible;
  font-size: 12px;
  line-height: 1.5;
  opacity: 0.9;
  box-sizing: border-box;
}
.${prefixCls}-hidden {
  display: none;
}
.${prefixCls}-placement-top,
.${prefixCls}-placement-topLeft,
.${prefixCls}-placement-topRight {
  padding: 5px 0 9px 0;
}
.${prefixCls}-placement-right,
.${prefixCls}-placement-rightTop,
.${prefixCls}-placement-rightBottom {
  padding: 0 5px 0 9px;
}
.${prefixCls}-placement-bottom,
.${prefixCls}-placement-bottomLeft,
.${prefixCls}-placement-bottomRight {
  padding: 9px 0 5px 0;
}
.${prefixCls}-placement-left,
.${prefixCls}-placement-leftTop,
.${prefixCls}-placement-leftBottom {
  padding: 0 9px 0 5px;
}
.${prefixCls}-inner {
  padding: 8px 10px;
  color: #fff;
  text-align: left;
  text-decoration: none;
  background-color: #373737;
  border-radius: 6px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.17);
  min-height: 34px;
  box-sizing: border-box;
}
.${prefixCls}-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}
.${prefixCls}-placement-top .${prefixCls}-arrow,
.${prefixCls}-placement-topLeft .${prefixCls}-arrow,
.${prefixCls}-placement-topRight .${prefixCls}-arrow {
  bottom: 4px;
  margin-left: -5px;
  border-width: 5px 5px 0;
  border-top-color: #373737;
}
.${prefixCls}-placement-top .${prefixCls}-arrow {
  left: 50%;
}
.${prefixCls}-placement-topLeft .${prefixCls}-arrow {
  left: 15%;
}
.${prefixCls}-placement-topRight .${prefixCls}-arrow {
  right: 15%;
}
.${prefixCls}-placement-right .${prefixCls}-arrow,
.${prefixCls}-placement-rightTop .${prefixCls}-arrow,
.${prefixCls}-placement-rightBottom .${prefixCls}-arrow {
  left: 4px;
  margin-top: -5px;
  border-width: 5px 5px 5px 0;
  border-right-color: #373737;
}
.${prefixCls}-placement-right .${prefixCls}-arrow {
  top: 50%;
}
.${prefixCls}-placement-rightTop .${prefixCls}-arrow {
  top: 15%;
  margin-top: 0;
}
.${prefixCls}-placement-rightBottom .${prefixCls}-arrow {
  bottom: 15%;
}
.${prefixCls}-placement-left .${prefixCls}-arrow,
.${prefixCls}-placement-leftTop .${prefixCls}-arrow,
.${prefixCls}-placement-leftBottom .${prefixCls}-arrow {
  right: 4px;
  margin-top: -5px;
  border-width: 5px 0 5px 5px;
  border-left-color: #373737;
}
.${prefixCls}-placement-left .${prefixCls}-arrow {
  top: 50%;
}
.${prefixCls}-placement-leftTop .${prefixCls}-arrow {
  top: 15%;
  margin-top: 0;
}
.${prefixCls}-placement-leftBottom .${prefixCls}-arrow {
  bottom: 15%;
}
.${prefixCls}-placement-bottom .${prefixCls}-arrow,
.${prefixCls}-placement-bottomLeft .${prefixCls}-arrow,
.${prefixCls}-placement-bottomRight .${prefixCls}-arrow {
  top: 4px;
  margin-left: -5px;
  border-width: 0 5px 5px;
  border-bottom-color: #373737;
}
.${prefixCls}-placement-bottom .${prefixCls}-arrow {
  left: 50%;
}
.${prefixCls}-placement-bottomLeft .${prefixCls}-arrow {
  left: 15%;
}
.${prefixCls}-placement-bottomRight .${prefixCls}-arrow {
  right: 15%;
}

`);
