import type { MutableRefObject } from 'react';
import { useEffect } from 'react';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';
import { EventManager } from 'mjolnir.js';
import { useEventListener, useMemoizedFn } from 'ahooks';
import { useThis } from '@orca-fe/hooks';
import { clamp } from '@orca-fe/tools';

export type Viewport = {
  center: [number, number];
  zoom: number;
};

export type UseViewportType = {
  ref: MutableRefObject<Element | null>;
  viewport: Viewport;
  onPointerDown?: (e: MjolnirPointerEvent) => boolean;
  onViewportChange?: (viewport: Viewport) => void;
  zoomStep?: number;
  maxZoomStep?: number;
  maxZoom?: number;
  minZoom?: number;
  wheelMode?: 'zoom' | 'move';
};

const ef = () => {};

export function useViewport(options: UseViewportType) {
  const {
    ref,
    viewport,
    onViewportChange = ef,
    zoomStep = 0.02,
    maxZoomStep = 0.3,
    maxZoom = 10,
    minZoom = -10,
    onPointerDown = ef,
    wheelMode = 'zoom',
  } = options;
  const _this = useThis({
    startViewport: null as null | Viewport,
  });

  const handlePointerDown = useMemoizedFn((e: MjolnirPointerEvent) => {
    if (e.leftButton) {
      const res = onPointerDown(e);
      if (res === false) return;
      _this.startViewport = viewport;
    }
  });
  const handlePointerMove = useMemoizedFn((e: MjolnirPointerEvent) => {});
  const handlePointerUp = useMemoizedFn((e: MjolnirPointerEvent) => {
    _this.startViewport = null;
  });

  const handlePan = useMemoizedFn((e: MjolnirGestureEvent) => {
    if (_this.startViewport) {
      const { center } = _this.startViewport;
      onViewportChange({
        ..._this.startViewport,
        center: [center[0] - e.deltaX, center[1] - e.deltaY],
      });
    }
    if (e.isFinal) {
      _this.startViewport = null;
    }
  });

  useEventListener(
    'dragstart',
    (e) => {
      e.preventDefault();
    },
    { target: ref },
  );

  useEventListener(
    'wheel',
    (e: WheelEvent) => {
      e.preventDefault();
      let bounds = {
        top: 0,
        left: 0,
      };
      if (e.currentTarget instanceof Element) {
        bounds = e.currentTarget.getBoundingClientRect();
      }
      const offsetCenter = {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      };

      const { zoom, center } = viewport;
      if (wheelMode === 'zoom' || e.ctrlKey || e.metaKey) {
        const newZoom = clamp(zoom + clamp(-e.deltaY * zoomStep, -maxZoomStep, maxZoomStep), minZoom, maxZoom);
        const delta = {
          x: offsetCenter.x + center[0],
          y: offsetCenter.y + center[1],
        };

        const newCenter = [-offsetCenter.x + delta.x * 2 ** (newZoom - zoom), -offsetCenter.y + delta.y * 2 ** (newZoom - zoom)] as [number, number];

        onViewportChange({
          zoom: newZoom,
          center: newCenter,
        });
      } else {
        // 移动模式
        const newCenter = [center[0] + e.deltaX, center[1] + e.deltaY] as [number, number];

        onViewportChange({
          zoom,
          center: newCenter,
        });
      }
    },
    { target: ref, passive: false },
  );
  const handlePinchStart = useMemoizedFn((e: MjolnirGestureEvent) => {});
  const handlePinchMove = useMemoizedFn((e: MjolnirGestureEvent) => {});
  const handlePinchEnd = useMemoizedFn((e: MjolnirGestureEvent) => {});
  useEffect(() => {
    if (ref.current) {
      const eventManager = new EventManager(ref.current as HTMLElement, {});
      eventManager.on({
        pointerdown: handlePointerDown,
        pointermove: handlePointerMove,
        pointerup: handlePointerUp,
        pinchstart: handlePinchStart,
        pinchmove: handlePinchMove,
        pinchend: handlePinchEnd,
        pan: handlePan,
      });
      return () => {
        eventManager.off({
          pointerdown: handlePointerDown,
          pointermove: handlePointerMove,
          pointerup: handlePointerUp,
          pinchstart: handlePinchStart,
          pinchmove: handlePinchMove,
          pinchend: handlePinchEnd,
          pan: handlePan,
        });
      };
    }
    return undefined;
  }, []);
}

export default useViewport;
