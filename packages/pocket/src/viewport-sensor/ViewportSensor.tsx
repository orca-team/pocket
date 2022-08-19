import React, { useMemo, useRef, useState } from 'react';
import { useControllableProps } from '@orca-fe/hooks';
import { useEventListener, useMemoizedFn } from 'ahooks';
import useViewport, { UseViewportType, Viewport } from './useViewport';

export const ViewportSensorContext = React.createContext<Viewport>({
  zoom: 0,
  center: [0, 0],
});

export const GetViewportContext = React.createContext<
  () => { viewport: Viewport; mousePoint: [number, number] }
>(() => ({
  viewport: {
    center: [0, 0],
    zoom: 0,
  },
  mousePoint: [0, 0],
}));

export interface ViewportSensorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  center?: [number, number];
  zoom?: number;
  beforePointerDown?: UseViewportType['onPointerDown'];
  onPropsChange?: (viewport: Viewport) => void;
  maxZoom?: UseViewportType['maxZoom'];
  maxZoomStep?: UseViewportType['maxZoomStep'];
  zoomStep?: UseViewportType['zoomStep'];
  minZoom?: UseViewportType['minZoom'];
  wheelMode?: UseViewportType['wheelMode'];
}

const ViewportSensor = (props: ViewportSensorProps) => {
  const [
    {
      center,
      zoom,
      beforePointerDown,
      maxZoom,
      maxZoomStep,
      zoomStep,
      minZoom,
      wheelMode,
      ...otherProps
    },
    changeProps,
  ] = useControllableProps(props, {
    center: [0, 0] as [number, number],
    zoom: 0,
  });
  const rootRef = useRef<HTMLDivElement>(null);
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
    <ViewportSensorContext.Provider
      value={useMemo(() => ({ center, zoom }), [center, zoom])}
    >
      <GetViewportContext.Provider
        value={useMemoizedFn(() => ({
          viewport: { center, zoom },
          mousePoint: [
            Math.round((_this.currentPoint[0] + center[0]) / 2 ** zoom),
            Math.round((_this.currentPoint[1] + center[1]) / 2 ** zoom),
          ],
        }))}
      >
        <div ref={rootRef} {...otherProps} />
      </GetViewportContext.Provider>
    </ViewportSensorContext.Provider>
  );
};

ViewportSensor.GetViewportContext = GetViewportContext;
ViewportSensor.ViewportSensorContext = ViewportSensorContext;
ViewportSensor.useViewport = useViewport;

export default ViewportSensor;
