import type { ReactElement, RefObject } from 'react';
import React, { useMemo, useRef, useState } from 'react';
import { useControllableProps } from '@orca-fe/hooks';
import { useEventListener, useMemoizedFn } from 'ahooks';
import type { UseViewportType, Viewport } from './useViewport';
import useViewport from './useViewport';

export const ViewportSensorContext = React.createContext<Viewport>({
  zoom: 0,
  center: [0, 0],
});

export const GetViewportContext = React.createContext<() => { viewport: Viewport; mousePoint: [number, number] }>(() => ({
  viewport: {
    center: [0, 0],
    zoom: 0,
  },
  mousePoint: [0, 0],
}));

export interface ViewportSensorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {

  /**
   * 中心点位置
   */
  center?: [number, number];

  /**
   * 缩放级别
   */
  zoom?: number;

  /**
   * 鼠标按下事件之前，允许 `return false` 终止拖拽行为
   */
  beforePointerDown?: UseViewportType['onPointerDown'];

  /**
   * center/zoom 发生变化时触发
   */
  onPropsChange?: (viewport: Viewport) => void;

  /**
   * 最大缩放级别
   */
  maxZoom?: UseViewportType['maxZoom'];

  /**
   * 最大缩放步进（防止触摸板滚动过快）
   */
  maxZoomStep?: UseViewportType['maxZoomStep'];

  /**
   * 缩放步进
   */
  zoomStep?: UseViewportType['zoomStep'];

  /**
   * 最小缩放级别
   */
  minZoom?: UseViewportType['minZoom'];

  /**
   * 当触发鼠标滚轮时，实际的行为
   */
  wheelMode?: UseViewportType['wheelMode'];

  /**
   * 允许传入回调函数进行渲染
   * 如果是传入回调函数的方式，则表示手动处理其 refs
   */
  children?: React.HTMLAttributes<HTMLDivElement>['children'] | ((ref: RefObject<Element>) => ReactElement);
}

const ViewportSensor = (props: ViewportSensorProps) => {
  const [{ center, zoom, beforePointerDown, maxZoom, maxZoomStep, zoomStep, minZoom, wheelMode, children, ...otherProps }, changeProps] =
    useControllableProps(props, {
      center: [0, 0] as [number, number],
      zoom: 0,
    });
  const rootRef = useRef<Element>(null);
  useViewport({
    ref: rootRef,
    viewport: {
      center,
      zoom,
    },
    onPointerDown: beforePointerDown,
    onViewportChange: ({ zoom, center }) => {
      changeProps({
        zoom,
        center,
      });
    },
    maxZoom,
    maxZoomStep,
    zoomStep,
    minZoom,
    wheelMode,
  });

  const [_this] = useState({
    currentPoint: [0, 0] as [number, number],
  });

  useEventListener(
    'mousemove',
    (e) => {
      const target = e.currentTarget;
      if (target instanceof HTMLElement) {
        const { top, left } = target.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        const innerX = x - left;
        const innerY = y - top;
        _this.currentPoint = [innerX, innerY];
      }
    },
    { target: rootRef },
  );

  return (
    <ViewportSensorContext.Provider value={useMemo(() => ({ center, zoom }), [center, zoom])}>
      <GetViewportContext.Provider
        value={useMemoizedFn(() => ({
          viewport: { center, zoom },
          mousePoint: [Math.round((_this.currentPoint[0] + center[0]) / 2 ** zoom), Math.round((_this.currentPoint[1] + center[1]) / 2 ** zoom)] as [
            number,
            number,
          ],
        }))}
      >
        <div ref={rootRef as RefObject<HTMLDivElement>} {...otherProps}>
          {typeof children === 'function' ? children(rootRef) : children}
        </div>
      </GetViewportContext.Provider>
    </ViewportSensorContext.Provider>
  );
};

ViewportSensor.GetViewportContext = GetViewportContext;
ViewportSensor.ViewportSensorContext = ViewportSensorContext;
ViewportSensor.useViewport = useViewport;

export default ViewportSensor;
