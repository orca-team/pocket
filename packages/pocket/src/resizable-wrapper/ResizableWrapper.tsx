import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useEventListener, useMemoizedFn } from 'ahooks';
import { useControllableProps, useSizeListener } from '@orca-fe/hooks';
import { clamp } from '@orca-fe/tools';
import cn from 'classnames';
import useStyles from './ResizableWrapper.style';

export interface ResizableWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
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
  triggerOnResize?: boolean;
  cover?:
    | boolean
    | {
        zIndex?: number;
      };
}

/**
 * 可调整尺寸的容器
 * @param props
 * @constructor
 */
const ResizableWrapper = (props: ResizableWrapperProps, pRef) => {
  const { defaultWidth, cover, defaultHeight } = props;
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
      triggerOnResize = true,
      minHeight,
      minWidth,
      maxHeight,
      maxWidth,
      ...otherProps
    },
    changeProps,
  ] = useControllableProps(props, {
    width: defaultWidth,
    height: defaultHeight,
  });

  const styles = useStyles();

  const rootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(pRef, () => rootRef.current);

  const clampWidth = useMemo(() => (value: number) => clamp(value, minWidth, maxWidth), [minWidth, maxWidth]);
  const clampHeight = useMemo(() => (value: number) => clamp(value, minHeight, maxHeight), [minHeight, maxHeight]);

  const [_this] = useState<{
    size?: { width: number; height: number };
    // 用于添加到 body 上，覆盖屏幕，确保拖拽时可以监听到事件
    cover?: HTMLDivElement;
  }>({});

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
      if ((type === 'vertical' && verticalPosition === 'top') || (type === 'horizontal' && horizontalPosition === 'left')) {
        sign = -1;
      }
      const curNum = Math.max(1, initialNum + sign * (curMouse - initialMouse));
      if (type === 'vertical') {
        if (height !== curNum) changeProps({ height: clampHeight(curNum) });
      } else if (width !== curNum) {
        changeProps({ width: clampWidth(curNum) });
      }
    }
  });

  useEventListener('pointerup', () => {
    if (dragging) {
      setDragging(null);
    }
    // remove cover
    if (_this.cover) {
      document.body.removeChild(_this.cover);
      _this.cover = undefined;
    }
    if (_this.size) {
      if (triggerOnResize) {
        if (vertical && _this.size.height !== height) {
          changeProps({ height: clampHeight(_this.size.height) });
        }
        if (horizontal && _this.size.width !== width) {
          changeProps({ width: clampWidth(_this.size.width) });
        }
      }
      _this.size = undefined;
    }
  });

  useEventListener('pointerdown', () => {
    _this.size = undefined;
  });

  useSizeListener(() => {
    if (rootRef.current) {
      const { width, height } = rootRef.current.getBoundingClientRect();
      _this.size = { width, height };
    }
  }, rootRef);

  const showCover = useMemoizedFn(() => {
    // create cover
    if (!_this.cover && cover) {
      _this.cover = document.createElement('div');
      _this.cover.style.position = 'fixed';
      _this.cover.style.top = '0';
      _this.cover.style.left = '0';
      _this.cover.style.right = '0';
      _this.cover.style.bottom = '0';
      _this.cover.style.zIndex = typeof cover === 'object' && cover.zIndex != null ? cover.zIndex.toString() : '99999';
      if (horizontal) {
        _this.cover.style.cursor = 'ew-resize';
      } else if (vertical) {
        _this.cover.style.cursor = 'ns-resize';
      }
      document.body.appendChild(_this.cover);
    }
  });

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className}`}
      style={{
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        ...style,
        width,
        height,
        flexShrink: dragging ? 1 : '',
      }}
      {...otherProps}
    >
      {children}
      {vertical && (
        <div
          className={cn(styles.dragHandle, styles.handleVertical, {
            [styles.dragging]: dragging?.type === 'vertical',
            [styles.handleVerticalTop]: verticalPosition === 'top',
          })}
          draggable
          onMouseDown={(e) => {
            e.preventDefault();
            if (height != null) {
              setDragging({
                type: 'vertical',
                initialNum: height,
                initialMouse: e.clientY,
              });
              showCover();
            }
          }}
        />
      )}
      {horizontal && (
        <div
          className={cn(styles.dragHandle, styles.handleHorizontal, {
            [styles.dragging]: dragging?.type === 'horizontal',
            [styles.handleHorizontalLeft]: horizontalPosition === 'left',
          })}
          draggable
          onMouseDown={(e) => {
            e.preventDefault();
            if (width != null) {
              setDragging({
                type: 'horizontal',
                initialNum: width,
                initialMouse: e.clientX,
              });
              showCover();
            }
          }}
        />
      )}
    </div>
  );
};

export default React.forwardRef(ResizableWrapper);
