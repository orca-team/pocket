/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebounceEffect, useMemoizedFn } from 'ahooks';
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import PDFViewerContext, { PageViewport } from '../context';
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

  const renderPdf = useMemoizedFn(async () => {
    const canvas = canvasRef.current;
    if (!render) return;
    if (canvas && page) {
      const viewport = page.getViewport({ scale }) as PageViewport;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        const transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        // canvas.style.width = `${Math.floor(viewport.width)}px`;
        // canvas.style.height = `${Math.floor(viewport.height)}px`;
        if (_this.task) _this.task.cancel();
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
          })
          .catch((err) => {
            if (err.name !== 'RenderingCancelledException') {
              console.error(err);
            }
          });
        // task.promise.then(() => {
        //   _this.task = page.render({
        //     canvasContext: context,
        //     viewport,
        //   });
        // });
      }
    }
  });

  useLayoutEffect(() => {
    renderPdf();
  }, [render, page]);

  useDebounceEffect(
    () => {
      renderPdf();
    },
    [scale],
    { wait: 300 },
  );

  return (
    <div
      className={`${styles.root} ${className}`}
      onClick={() => {
        renderPdf();
      }}
      {...otherProps}
    >
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
};

export default PDFPage;
