import createUseStaticCss from '../createUseStaticCss';

export default createUseStaticCss(`
.rc-trigger-popup {
  position: absolute;
  top: -9999px;
  left: -9999px;
  z-index: 1050;
}
.rc-trigger-popup-hidden {
  display: none;
}
.rc-trigger-popup-zoom-enter,
.rc-trigger-popup-zoom-appear {
  opacity: 0;
  animation-play-state: paused;
  animation-timing-function: cubic-bezier(0.2, 0.89, 0.32, 1.28);
  animation-duration: 0.3s;
  animation-fill-mode: both;
}
.rc-trigger-popup-zoom-leave {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-play-state: paused;
  animation-timing-function: cubic-bezier(0.6, -0.3, 0.74, 0.05);
}
.rc-trigger-popup-zoom-enter.rc-trigger-popup-zoom-enter-active,
.rc-trigger-popup-zoom-appear.rc-trigger-popup-zoom-appear-active {
  animation-name: rcTriggerZoomIn;
  animation-play-state: running;
}
.rc-trigger-popup-zoom-leave.rc-trigger-popup-zoom-leave-active {
  animation-name: rcTriggerZoomOut;
  animation-play-state: running;
}
.rc-trigger-popup-arrow {
  width: 0px;
  height: 0px;
  background: #000;
  border-radius: 100vw;
  box-shadow: 0 0 0 3px black;
  z-index: 1;
}
@keyframes rcTriggerZoomIn {
  0% {
    transform: scale(0.9);
    transform-origin: 50% 50%;
    opacity: 0;
  }
  100% {
    transform: scale(1, 1);
    transform-origin: 50% 50%;
    opacity: 1;
  }
}
@keyframes rcTriggerZoomOut {
  0% {
    transform: scale(1, 1);
    transform-origin: 50% 50%;
    opacity: 1;
  }
  100% {
    transform: scale(0.9);
    transform-origin: 50% 50%;
    opacity: 0;
  }
}

`);
