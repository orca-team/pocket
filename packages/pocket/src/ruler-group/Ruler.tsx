import React, { useRef } from 'react';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { isMac } from '@orca-fe/tools';
import { useSizeListener } from '@orca-fe/hooks';
import useStyles from './Ruler.style';

const getStep = (n: number) => Math.trunc(n / 10 ** Math.max(0, Math.trunc(Math.log10(n))));

const ef = () => {};

export interface RulerProps extends React.HTMLAttributes<HTMLDivElement> {

  /* 标尺方向 */
  orientation?: 'vertical' | 'horizontal';

  /* 标尺尺寸 */
  size?: number;

  /* 缩放级别 */
  zoom?: number;

  /* 偏移量 */
  offsetX?: number;

  /* 偏移量 */
  offsetY?: number;

  /* 鼠标点击事件（带value） */
  onRulerClick?: (value: number, e: React.MouseEvent) => void;

  /* 鼠标移动事件（带value） */
  onRulerMouseMove?: (value: number | null, e: React.MouseEvent) => void;
}

const Ruler = (props: RulerProps) => {
  const {
    className = '',
    orientation = 'horizontal',
    size = 20,
    offsetX = 0,
    offsetY = 0,
    zoom = 0,
    style,
    onClick = ef,
    onMouseMove = ef,
    onMouseLeave = ef,
    onRulerClick = ef,
    onRulerMouseMove = ef,
    ...otherProps
  } = props;
  const styles = useStyles();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizeRef = useRef<{ width: number; height: number }>({
    width: 1000,
    height: 1000,
  });

  const isHorizon = orientation !== 'vertical';

  const offset = isHorizon ? offsetX : offsetY;

  /* 重绘标尺 */
  const drawDeg = () => {
    const { width, height } = sizeRef.current;
    const length = isHorizon ? width : height;

    const { current: canvas } = canvasRef;
    if (canvas) {
      const ratio = 2 ** zoom;

      if (isHorizon) {
        canvas.width = width;
        canvas.height = size;
      } else {
        canvas.width = size;
        canvas.height = height;
      }

      /* 先随意计算了一个标尺步进 */
      const step = Math.max(
        1,
        (() => {
          const r = Math.trunc(10 / ratio);
          const s = getStep(r) || 1;
          const n = 10 ** Math.trunc(Math.log10(r)) || 1;

          if (s >= 5) return 5 * n;
          if (s >= 2) return 2 * n;
          return n;
        })(),
      );

      const ctx = canvas.getContext('2d');
      if (ctx == null) return;

      ctx.save();
      if (!isHorizon) {
        /* 纵向标尺，旋转画布 */
        ctx.translate(size, 0);
        ctx.rotate((90 * Math.PI) / 180);
      }
      ctx.clearRect(0, 0, length, size);

      /* 刻度样式 */
      ctx.strokeStyle = '#666666';

      /* 文本样式 */
      ctx.fillStyle = '#333333';

      ctx.lineWidth = 1 / window.devicePixelRatio;

      // 获得起始数值
      let i = 0;
      if (offset < 0) {
        i = Math.floor(-offset / ratio / step) * step;
      }

      const pixel = (v: number) => {
        const res = offset + v * ratio;
        return res;
      };

      ctx.beginPath();

      for (; pixel(i) <= length; i += step) {
        const num = Math.floor(i / step);
        let top = 0.8 * size;
        const left = pixel(i);
        if (num % 10 === 0) {
          top = 0.2 * size;
          ctx.fillText(`${i}`, Math.round(left + 2) + (isMac() ? 0.5 : 0), Math.round(0.55 * size) + 0.5);
        } else if (num % 5 === 0) {
          top = 0.6 * size;
        }
        ctx.moveTo(Math.round(left) + 0.5, Math.round(top));
        ctx.lineTo(Math.round(left) + 0.5, Math.round(size));
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  };

  useSizeListener(({ width, height }) => {
    sizeRef.current.width = width;
    sizeRef.current.height = height;
    drawDeg();
  }, rootRef);

  useUpdateEffect(() => {
    drawDeg();
  }, [zoom, offsetY, offsetX]);

  /* 根据鼠标事件，计算出鼠标位置对应的标尺值 */
  const getRulerValueByEvent = useMemoizedFn((e) => {
    const { current: div } = rootRef;
    if (div) {
      if (isHorizon) {
        const { left } = div.getBoundingClientRect();
        const x = (e.clientX - left - offsetX) / 2 ** zoom;
        return Math.round(x);
      }
      const { top } = div.getBoundingClientRect();
      const y = (e.clientY - top - offsetY) / 2 ** zoom;
      return Math.round(y);
    }
    return null;
  });

  const handleClick = useMemoizedFn((e) => {
    const value = getRulerValueByEvent(e);
    if (value != null) {
      onRulerClick(value, e);
    }
    onClick(e);
  });

  const handleMouseMove = useMemoizedFn((e) => {
    const value = getRulerValueByEvent(e);
    if (value != null) {
      onRulerMouseMove(value, e);
    }
    onMouseMove(e);
  });

  const handleMouseLeave = useMemoizedFn((e) => {
    onRulerMouseMove(null, e);
    onMouseLeave(e);
  });

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className}`}
      {...otherProps}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        ...(isHorizon
          ? {
            cursor: 'ew-resize',
            overflowY: 'visible',
            height: size,
          }
          : {
            cursor: 'ns-resize',
            overflowX: 'visible',
            width: size,
          }),
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Ruler;
