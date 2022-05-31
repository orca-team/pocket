import React, { useImperativeHandle, useRef, useState } from 'react';
import pc from 'prefix-classnames';
import { useEventListener } from 'ahooks';
import { useControllableProps } from '@orca-fe/hooks';

const px = pc('resizable-wrapper');

export interface ResizableWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  horizontal?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  onWidthChange?: (width: number) => void;
  onHeightChange?: (height: number) => void;
  verticalPosition?: 'top' | 'bottom';
  horizontalPosition?: 'left' | 'right';
}

/**
 * 可调整尺寸的容器
 * @param props
 * @constructor
 */
const ResizableWrapper = (props: ResizableWrapperProps, pRef) => {
  const { defaultWidth, defaultHeight } = props;
  const [
    {
      className = '',
      children,
      vertical,
      horizontal,
      width,
      height,
      style,
      defaultHeight: _nouse1,
      defaultWidth: _nouse2,
      verticalPosition = 'right',
      horizontalPosition = 'bottom',
      ...otherProps
    },
    changeProps,
  ] = useControllableProps(props, {
    width: defaultWidth,
    height: defaultHeight,
  });

  const rootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(pRef, () => rootRef.current);

  const [dragging, setDragging] = useState<{
    type: 'vertical' | 'horizontal';
    initialNum: number;
    initialMouse: number;
  } | null>(null);

  useEventListener('mousemove', (e) => {
    if (dragging) {
      const { initialNum, initialMouse, type } = dragging;
      const curMouse = type === 'vertical' ? e.clientY : e.clientX;
      let sign = 1;
      if (
        (type === 'vertical' && verticalPosition === 'top') ||
        (type === 'horizontal' && horizontalPosition === 'left')
      ) {
        sign = -1;
      }
      const curNum = initialNum + sign * (curMouse - initialMouse);
      if (type === 'vertical') {
        if (height !== curNum) changeProps({ height: curNum });
      } else if (width !== curNum) {
        changeProps({ width: curNum });
      }
    }
  });

  useEventListener('pointerup', () => {
    if (dragging) {
      setDragging(null);
    }
  });

  return (
    <div
      ref={rootRef}
      className={`${px('root')} ${className}`}
      style={{ ...style, width, height }}
      {...otherProps}
    >
      {children}
      {vertical && (
        <div
          className={px('handle-vertical', {
            dragging: dragging?.type === 'vertical',
            'handle-vertical-top': verticalPosition === 'top',
          })}
          draggable
          onDragStart={(e) => {
            e.preventDefault();
            if (height != null) {
              setDragging({
                type: 'vertical',
                initialNum: height,
                initialMouse: e.clientY,
              });
            }
          }}
        />
      )}
      {horizontal && (
        <div
          className={px('handle-horizontal', {
            dragging: dragging?.type === 'horizontal',
            'handle-horizontal-left': horizontalPosition === 'left',
          })}
          draggable
          onDragStart={(e) => {
            e.preventDefault();
            if (width != null) {
              setDragging({
                type: 'horizontal',
                initialNum: width,
                initialMouse: e.clientX,
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default React.forwardRef(ResizableWrapper);
