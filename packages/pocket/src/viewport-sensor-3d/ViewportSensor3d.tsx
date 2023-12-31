import type { ReactElement, RefObject } from 'react';
import React, { useMemo, useRef, useState } from 'react';
import { useControllableValue, useEventListener } from 'ahooks';
import { usePan } from '@orca-fe/hooks';
import { clamp } from '@orca-fe/tools';
import type { Viewport3dType } from './Viewport3d';
import Viewport3d from './Viewport3d';
import { Viewport3dContext } from './context';

const defaultViewport: Viewport3dType = {
  left: 0,
  top: 0,
  zoom: 0,
  rotate: 0,
  pitch: 0,
};

export interface ViewportSensorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  viewport?: Viewport3dType;
  onViewportChange?: (viewport: Viewport3dType) => void;

  /**
   * 允许传入回调函数进行渲染
   * 如果是传入回调函数的方式，则表示手动处理其 refs
   */
  children?: React.HTMLAttributes<HTMLDivElement>['children'] | ((ref: RefObject<Element>) => ReactElement);
}

const ViewportSensor3d = (props: ViewportSensorProps) => {
  const { viewport: nouse, onViewportChange, children, ...otherProps } = props;
  const [viewport = defaultViewport, setViewport] = useControllableValue(props, {
    defaultValue: defaultViewport,
    defaultValuePropName: 'defaultViewport',
    valuePropName: 'viewport',
    trigger: 'onViewportChange',
  });

  // const [_vp] = useState(() => new Viewport3d(viewport));

  const rootRef = useRef<Element>(null);

  const [_this] = useState<{
    startViewport?: Viewport3d;
    startPosition?: [number, number];
    button?: number;
  }>({});

  // console.log(viewport);

  usePan(({ start, startPosition, offset, ev, bounds }) => {
    if (start) {
      _this.button = ev.button;
      const viewport3d = new Viewport3d(viewport);
      _this.startViewport = viewport3d;
      _this.startPosition = startPosition;

      if (ev.button === 2) {
        ev.preventDefault();
      }
    } else if (_this.startViewport && _this.startPosition) {
      // 监听右键
      if (_this.button === 2) {
        // 右键旋转
        const viewport = _this.startViewport.getViewportByRotate([bounds.width / 2, bounds.height / 2], -offset[0] / 2);
        setViewport(viewport);
        return;
      }

      const viewport = _this.startViewport.getViewportByScreenPoint(_this.startViewport.unproject(_this.startPosition), [
        startPosition[0] + offset[0],
        startPosition[1] + offset[1],
      ]);
      setViewport(viewport);
    }
  }, rootRef);

  useEventListener(
    'contextmenu',
    (ev) => {
      ev.preventDefault();
    },
    { target: rootRef },
  );

  // 滚轮事件 -> 缩放
  useEventListener(
    'wheel',
    (event: WheelEvent) => {
      event.preventDefault();
      const { deltaY } = event;
      const target = event.currentTarget as HTMLElement;
      // 获得屏幕坐标
      const { left, top } = target.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      const newZoom = viewport.zoom - clamp(deltaY, -30, 30) / 100;

      const viewport3d = new Viewport3d(viewport);
      const vp = viewport3d.getViewportByZoom([x, y], newZoom);
      setViewport(vp);
    },
    { target: rootRef },
  );

  return (
    <Viewport3dContext.Provider value={useMemo(() => ({ viewport }), [viewport])}>
      <div ref={rootRef as RefObject<HTMLDivElement>} {...otherProps}>
        {typeof children === 'function' ? children(rootRef) : children}
      </div>
    </Viewport3dContext.Provider>
  );
};

ViewportSensor3d.Context = Viewport3dContext;
ViewportSensor3d.Viewport3d = Viewport3d;

export default ViewportSensor3d;
