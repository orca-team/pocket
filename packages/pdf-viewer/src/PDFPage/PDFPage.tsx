/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebounceFn, useMemoizedFn, useUpdateEffect } from 'ahooks';
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import type { PageViewport } from '../context';
import PDFViewerContext from '../context';
import useStyle from './PDFPage.style';

const outputScale = window.devicePixelRatio || 1;

export interface PdfPageProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  render?: boolean;
  zoom?: number;
}

const PDFPage = (props: PdfPageProps) => {
  const { className = '', index, render, zoom = 0, ...otherProps } = props;
  const styles = useStyle();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scale = 2 ** zoom;

  const [_this] = useState<{
    task?: any;
  }>({});

  const { pages } = useContext(PDFViewerContext);
  const page = pages[index];
  // const viewport = useMemo(() => {
  //   if (page) {
  //     return page.getViewport({ scale }) as PageViewport;
  //   }
  //   return null;
  // }, [page, scale]);

  const renderPdf = useMemoizedFn(async (twice = false) => {
    const canvas = canvasRef.current;
    if (!render) return;
    if (canvas && page) {
      const viewport = page.getViewport({ scale }) as PageViewport;
      canvas.width = Math.ceil(viewport.width * outputScale);
      canvas.height = Math.ceil(viewport.height * outputScale);
      const context = canvas.getContext('2d');
      if (context) {
        const transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        // canvas.style.width = `${Math.floor(viewport.width)}px`;
        // canvas.style.height = `${Math.floor(viewport.height)}px`;
        if (_this.task && typeof _this.task.cancel === 'function') {
          _this.task.cancel();
        }
        const task = page.render({
          canvasContext: context,
          transform,
          viewport,
        });
        _this.task = task;
        task.promise.catch((err) => {
          if (err.name !== 'RenderingCancelledException') {
            console.error(err);
          }
        });

        task.promise
          .then(() => {
            _this.task = undefined;
            if (twice) {
              setTimeout(() => {
                if (!_this.task) {
                  _this.task = page
                    .render({
                      canvasContext: context,
                      transform,
                      viewport,
                    })
                    .promise.then(() => {
                      _this.task = undefined;
                    });
                }
              }, 0);
            }
          })
          .catch((err) => {
            if (err.name !== 'RenderingCancelledException') {
              console.error(err);
            }
          });
      }
    }
  });

  useLayoutEffect(() => {
    renderPdf();
  }, [render, page]);

  const renderPdfDebounce = useDebounceFn(renderPdf, { wait: 300 });

  useUpdateEffect(() => {
    renderPdfDebounce.run(true);
  }, [scale]);

  return (
    <div className={`${styles.root} ${className}`} {...otherProps}>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
};

export default PDFPage;
