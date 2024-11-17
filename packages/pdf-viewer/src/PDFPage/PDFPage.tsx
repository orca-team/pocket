/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebounceFn, useMemoizedFn, useUpdateEffect } from 'ahooks';
import React, { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { floorBy } from '@orca-fe/tools';
import type { RenderTask } from 'pdfjs-dist';
import PDFViewerContext from '../context';
import useStyle from './PDFPage.style';
import { PixelsPerInch } from '../utils';
import { useAsyncQueue } from '../AsyncQueueProvider/AsyncQueueProvider';

type AnyFunc = (...args: any[]) => any;

const globalOutputScale = Math.max(window.devicePixelRatio, 1);

const defaultMaxPixel = 14745600;

const floor = floorBy(0.001);

export interface PdfPageProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  render?: boolean;
  zoom?: number;
  maxPixel?: number;
  outputScale?: number;
}

const PDFPage = (props: PdfPageProps) => {
  const { className = '', index, render, zoom = 0, maxPixel = defaultMaxPixel, outputScale = globalOutputScale, ...otherProps } = props;
  const styles = useStyle();

  const rootRef = useRef<HTMLDivElement>(null);

  const scale = 2 ** zoom * PixelsPerInch.PDF_TO_CSS_UNITS;

  const [_this] = useState<{
    cancel?: AnyFunc;
    task?: RenderTask;
    canvasList: HTMLCanvasElement[];
  }>({
    canvasList: [],
  });

  const { pages } = useContext(PDFViewerContext);
  const page = pages[index];

  const { addTask } = useAsyncQueue({ index });

  const { viewport, scale: realScale } = useMemo(() => {
    const viewport = page.getViewport({ scale });
    const pixel = viewport.width * viewport.height;
    if (pixel > maxPixel) {
      const scaleLimit = floor(scale * (maxPixel / pixel) ** 0.5);
      return {
        viewport: page.getViewport({ scale: scaleLimit }),
        scale: scaleLimit,
      };
    }
    return { viewport, scale };
  }, [page, scale, maxPixel]);

  const renderPdf = useMemoizedFn(async () => {
    if (typeof _this.cancel === 'function') {
      _this.cancel();
    }
    _this.cancel = addTask(() => {
      const canvas = document.createElement('canvas');
      canvas.classList.add(...styles.canvas.split(' '));
      const root = rootRef.current;
      if (root) {
        root.appendChild(canvas);
        _this.canvasList.push(canvas);
      }

      if (!render) return undefined;
      if (canvas && page) {
        canvas.width = Math.ceil(viewport.width * outputScale);
        canvas.height = Math.ceil(viewport.height * outputScale);
        canvas.hidden = true;
        const context = canvas.getContext('2d', { alpha: false });
        if (context) {
          const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

          // 添加一个队列任务
          const task = page.render({
            canvasContext: context,
            transform,
            viewport,
          });
          _this.task = task;

          return task.promise
            .then(() => {
              _this.task = undefined;
              canvas.hidden = false;
              const root = rootRef.current;
              if (root) {
                _this.canvasList.forEach((node) => {
                  if (node !== canvas) root.removeChild(node);
                });
                _this.canvasList = _this.canvasList.filter(node => node === canvas);
              }
            })
            .catch((err) => {
              if (err.name !== 'RenderingCancelledException') {
                console.error(err);
              } else if (err instanceof Error) {
                console.warn(err.message);
              }
            });
        }
      }
      return undefined;
    });
  });

  useLayoutEffect(() => {
    renderPdf();
    return () => {
      if (typeof _this.cancel === 'function') {
        _this.cancel();
      }
    };
  }, [render, page]);

  const renderPdfDebounce = useDebounceFn(renderPdf, { wait: 300 });

  useUpdateEffect(() => {
    renderPdfDebounce.run();
  }, [realScale]);

  return <div ref={rootRef} className={`${styles.root} ${className}`} {...otherProps} />;
};

export default PDFPage;
