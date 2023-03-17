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

  const rootRef = useRef<HTMLDivElement>(null);

  const scale = 2 ** zoom;

  const [_this] = useState<{
    task?: any;
    canvasList: HTMLCanvasElement[];
  }>({
    canvasList: [],
  });

  const { pages } = useContext(PDFViewerContext);
  const page = pages[index];

  const renderPdf = useMemoizedFn(async (twice = false) => {
    const canvas = document.createElement('canvas');
    canvas.classList.add(...styles.canvas.split(' '));

    if (!render) return;
    if (canvas && page) {
      const viewport = page.getViewport({
        scale: Math.min(2 * outputScale, scale),
      }) as PageViewport;
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
            const root = rootRef.current;
            if (root) {
              root.appendChild(canvas);
              _this.canvasList.forEach((node) => {
                root.removeChild(node);
              });
              _this.canvasList = [canvas];
            }
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
    renderPdfDebounce.run(false);
  }, [scale]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className}`}
      {...otherProps}
    />
  );
};

export default PDFPage;
