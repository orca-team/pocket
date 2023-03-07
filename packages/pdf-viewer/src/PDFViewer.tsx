/* eslint-disable @typescript-eslint/no-explicit-any */
import { clamp } from '@orca-fe/tools';
import { useDebounceFn, useEventListener, useMemoizedFn } from 'ahooks';
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PageViewport } from './context';
import PDFViewerContext from './context';
import PDFPage from './PDFPage';
import PDFToolbar from './PDFToolbar';
import useStyle from './PDFViewer.style';
import * as _pdfJS from './pdfjs-build/pdf';
import * as pdfjsWorker from './pdfjs-build/pdf.worker';

const pdfJs: any = _pdfJS;

const ef = () => undefined;

function findSortedArr(
  arr: number[],
  value: number,
  start = 0,
  end = arr.length,
) {
  const index = Math.floor((start + end) / 2);
  if (arr[end - 1] < value) return end;
  if (index === start) {
    return index;
  }
  if (arr[index] === value) {
    return index;
  }
  if (arr[index] < value) {
    const res = findSortedArr(arr, value, index + 1, end);
    if (res >= 0) return res;
  }
  if (index === 0) return 0;
  if (arr[index - 1] < value) return index;
  return findSortedArr(arr, value, start, index);
}

export type PDFViewerHandle = {
  load: (file: ArrayBuffer) => Promise<void>;
  setZoom: (zoom: number) => void;
  getZoom: () => void;
  changePage: (pageIndex: number, anim?: boolean) => void;
  scrollTo: Element['scrollTo'];
  getCurrentPage: () => number;
  getPageCount: () => number;
  getPageBlob: (
    index: number,
    options?: { scale?: number },
  ) => Promise<Blob | null>;
};

export interface PDFViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  pageGap?: number;
  maxZoom?: number;
  minZoom?: number;
  onPageScroll?: React.UIEventHandler<HTMLDivElement>;
  renderPageCover?: (
    pageIndex: number,
    options: { viewport: PageViewport },
  ) => React.ReactNode;
}

const PDFViewer = React.forwardRef<PDFViewerHandle, PDFViewerProps>(
  (props, pRef) => {
    const {
      className = '',
      pageGap = 24,
      maxZoom = 3,
      minZoom = -4,
      renderPageCover = ef,
      style,
      onPageScroll,
      ...otherProps
    } = props;

    useEffect(() => {
      if (!window['pdfjsWorker']) {
        window['pdfjsWorker'] = pdfjsWorker;
      }
    }, []);

    const styles = useStyle();

    const pageContainerRef = useRef<HTMLDivElement>(null);

    const [current, setCurrent] = useState(0);

    const [zoom, setZoom] = useState(0);

    const scale = 2 ** zoom;

    const [_this] = useState<{
      pages: any[];
      pdfDoc?: any;
      mousePositionBeforeWheel?: { x: number; y: number; zoom: number };
      prevZoom: number;
    }>({
      pages: [],
      prevZoom: zoom,
    });

    const [renderRange, setRenderRange] = useState<[number, number]>([0, 0]);

    const [pages, setPages] = useState<any[]>([]);

    const viewports = useMemo(
      () =>
        pages.map((page) => {
          const viewport = page.getViewport({ scale: 1 }) as PageViewport;
          return viewport;
        }),
      [pages],
    );

    const { topArr: pageTopArr, maxWidth } = useMemo(() => {
      let top = 0;
      let maxWidth = 0;
      const topArr = viewports.map(({ height, width }) => {
        const _top = top;
        top += Math.floor(height + pageGap) * scale;
        maxWidth = Math.max(width * scale, maxWidth);
        return _top;
      });
      return { topArr, maxWidth };
    }, [viewports, pageGap, scale]);

    // 翻頁
    const changePage = useMemoizedFn((page: number, anim = false) => {
      const dom = pageContainerRef.current;
      if (dom) {
        const top = pageTopArr[page];
        dom.scrollTo({
          top,
          behavior: anim ? 'smooth' : 'auto',
        });
      }
    });

    const load = useMemoizedFn<PDFViewerHandle['load']>(async (file) => {
      if (pdfJs) {
        const pdfDoc = await pdfJs.getDocument(file).promise;
        // 總頁數
        if (pdfDoc) {
          _this.pdfDoc = pdfDoc;
          const pageLength = pdfDoc.numPages;
          const allPages = await Promise.all(
            new Array(pageLength).fill(0).map(async (_, index) => {
              const pageNum = index + 1;
              const page = await pdfDoc.getPage(pageNum);
              return page;
            }),
          );
          _this.pages = allPages;
          setPages(allPages);
          const dom = pageContainerRef.current;
          if (dom) {
            dom.scrollTop = 0;
          }
        }
      }
    });
    const getZoom = useMemoizedFn<PDFViewerHandle['getZoom']>(() => zoom);
    const scrollTo = useMemoizedFn<PDFViewerHandle['scrollTo']>((...args) => {
      const dom = pageContainerRef.current;
      if (dom) dom.scrollTo(...args);
    });
    const getCurrentPage = useMemoizedFn<PDFViewerHandle['getCurrentPage']>(
      () => current,
    );
    const getPageCount = useMemoizedFn<PDFViewerHandle['getPageCount']>(
      () => _this.pages.length,
    );

    // 獲取頁面的圖片
    const getPageBlob = useMemoizedFn<PDFViewerHandle['getPageBlob']>(
      async (index, options = {}) => {
        const { scale = 2 } = options;
        const { pages } = _this;
        if (index < 0 || index >= pages.length) return null;
        const canvas = document.createElement('canvas');
        document.body.append(canvas);
        try {
          canvas.style.display = 'none';
          const page = pages[index];
          const viewport = page.getViewport({
            scale: scale * window.devicePixelRatio,
          });
          const context = canvas.getContext('2d');
          if (context) {
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            canvas.style.width = `${Math.floor(viewport.width)}px`;
            canvas.style.height = `${Math.floor(viewport.height)}px`;
            const task = page.render({
              canvasContext: context,
              viewport,
            });
            await task.promise;
            const blob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob((blob) => {
                resolve(blob);
              });
            });
            return blob;
          }
        } catch (error) {
          console.error(error);
        } finally {
          document.body.removeChild(canvas);
        }
        return null;
      },
    );

    useImperativeHandle(pRef, () => ({
      load,
      setZoom,
      getZoom,
      changePage,
      getPageBlob,
      getCurrentPage,
      getPageCount,
      scrollTo,
    }));

    const updateRenderRange = useMemoizedFn(() => {
      const dom = pageContainerRef.current;
      if (dom) {
        const top = dom.scrollTop;
        const height = dom.clientHeight;

        const currentPage = Math.max(
          findSortedArr(pageTopArr, top + 0.5 * height) - 1,
          0,
        );
        let startPage = findSortedArr(pageTopArr, top - 50);
        startPage = Math.max(0, startPage - 1);
        let pageBottom = pageTopArr[startPage];
        let endPage = startPage;
        while (
          viewports[endPage] &&
          pageBottom + viewports[endPage].height * scale <= top + height + 50
        ) {
          pageBottom += (viewports[endPage].height + pageGap) * scale;
          endPage += 1;
        }
        if (current !== currentPage) {
          setCurrent(currentPage);
        }
        if (renderRange[0] !== startPage || renderRange[1] !== endPage) {
          setRenderRange([startPage, endPage]);
        }
      }
    });

    const updateRenderRangeDebounce = useDebounceFn(
      () => {
        updateRenderRange();
        _this.mousePositionBeforeWheel = undefined;
      },
      { wait: 280 },
    );

    useEventListener(
      'scroll',
      (ev) => {
        if (_this.prevZoom !== zoom) {
          _this.prevZoom = zoom;
          updateRenderRangeDebounce.run();
        } else {
          updateRenderRangeDebounce.cancel();
          updateRenderRange();
        }
      },
      { target: pageContainerRef, passive: true },
    );

    useEffect(() => {
      updateRenderRangeDebounce.run();
    }, [zoom]);

    // 監聽滾輪事件，縮放頁面
    useEventListener(
      'wheel',
      (ev: WheelEvent) => {
        const dom = pageContainerRef.current;
        if (ev.ctrlKey && dom) {
          const { left, top, width } = dom.getBoundingClientRect();
          const { clientX, clientY } = ev;
          const x = clientX - left;
          const y = clientY - top;

          if (!_this.mousePositionBeforeWheel) {
            _this.mousePositionBeforeWheel = {
              x:
                x +
                dom.scrollLeft -
                0.5 * (maxWidth < width ? width - maxWidth : 0),
              y: y + dom.scrollTop,
              zoom,
            };
          }

          const newZoom = clamp(
            zoom - clamp(ev.deltaY, -40, 40) * 0.01,
            minZoom,
            maxZoom,
          );
          setZoom(newZoom);
          if (_this.mousePositionBeforeWheel) {
            // 更新滾動條高度
            const {
              x: fullScrollLeft,
              y: fullScrollTop,
              zoom: originZoom,
            } = _this.mousePositionBeforeWheel;
            const zoomDiff = newZoom - originZoom;
            const newScrollLeft = fullScrollLeft * 2 ** zoomDiff - x;
            const newScrollTop = fullScrollTop * 2 ** zoomDiff - y;

            const pageDom = pageContainerRef.current;
            if (pageDom) {
              pageDom.style.setProperty('--scale-factor', `${2 ** newZoom}`);
            }
            dom.scrollTop = newScrollTop;
            dom.scrollLeft = newScrollLeft;
            // nextTick(() => {
            //
            // });
          }
        }
      },
      { target: pageContainerRef, passive: true },
    );

    useEventListener(
      'wheel',
      (ev: WheelEvent) => {
        if (ev.ctrlKey) {
          ev.preventDefault();
        }
      },
      { target: pageContainerRef },
    );

    const setZoomForToolbar = useMemoizedFn((newZoom: number) => {
      const dom = pageContainerRef.current;
      if (dom) {
        const { scrollTop, scrollLeft } = dom;
        const zoomDiff = newZoom - zoom;
        const newScrollLeft = scrollLeft * 2 ** zoomDiff;
        const newScrollTop = scrollTop * 2 ** zoomDiff;
        setZoom(newZoom);
        const pageDom = pageContainerRef.current;
        if (pageDom) {
          pageDom.style.setProperty('--scale-factor', `${2 ** newZoom}`);
        }
        dom.scrollTop = newScrollTop;
        dom.scrollLeft = newScrollLeft;
      }
    });

    return (
      <PDFViewerContext.Provider
        value={useMemo(
          () => ({
            pages,
            zoom,
            current,
            changePage,
            setZoom: setZoomForToolbar,
          }),
          [pages, zoom, current],
        )}
      >
        <div
          className={`${styles.root} ${className}`}
          style={{
            ...style,
          }}
          {...otherProps}
        >
          {pages.length > 0 && (
            <PDFToolbar
              className={styles.toolbar}
              max={2 ** maxZoom}
              min={2 ** minZoom}
            />
          )}
          <div
            ref={pageContainerRef}
            className={styles.pages}
            onScroll={onPageScroll}
            style={{
              // @ts-expect-error
              '--scale-factor': scale,
            }}
          >
            {viewports.map((viewport, index) => {
              const shouldRender =
                index >= renderRange[0] && index <= renderRange[1];
              return (
                <div
                  key={index}
                  className={styles.pageContainer}
                  style={{
                    width: `calc(var(--scale-factor) * ${Math.floor(
                      viewport.width,
                    )}px)`,
                    height: `calc(var(--scale-factor) * ${Math.floor(
                      viewport.height,
                    )}px)`,
                    marginBottom: `calc(var(--scale-factor) * ${pageGap}px)`,
                  }}
                >
                  {shouldRender && (
                    <>
                      <PDFPage
                        index={index}
                        zoom={zoom}
                        render={shouldRender}
                        style={{ width: '100%', height: '100%' }}
                      />
                      <div className={styles.pageCover}>
                        {renderPageCover(index, { viewport })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </PDFViewerContext.Provider>
    );
  },
);

PDFViewer.displayName = 'PDFViewer';

export const usePdfViewerRef = () => useRef<PDFViewerHandle>(null);

export default PDFViewer;
