/* eslint-disable @typescript-eslint/no-explicit-any */
import { clamp } from '@orca-fe/tools';
import {
  useDebounceEffect,
  useDebounceFn,
  useEventListener,
  useMemoizedFn,
} from 'ahooks';
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useGetState } from '@orca-fe/hooks';
import type { PainterRef, ShapeDataType, ShapeType } from '@orca-fe/painter';
import Painter from '@orca-fe/painter';
import type { PageViewport } from './context';
import PDFViewerContext, { PDFToolbarContext } from './context';
import PDFPage from './PDFPage';
import PDFToolbar from './PDFToolbar';
import useStyle from './PDFViewer.style';
import * as _pdfJS from './pdfjs-build/pdf';
import * as pdfjsWorker from './pdfjs-build/pdf.worker';
import { findSortedArr } from './utils';
import PainterToolbar from './PainterToolbar';

const pdfJs: any = _pdfJS;

const ef = () => undefined;

const defaultEmptyTips = (
  <div className="pdf-viewer-default-empty-tips">请打开一个 PDF 文件</div>
);

export type PDFViewerHandle = {
  load: (file: string | URL | File | ArrayBuffer) => Promise<void>;
  setZoom: (zoom: number) => void;
  getZoom: () => number;
  changePage: (pageIndex: number, anim?: boolean) => void;
  scrollTo: Element['scrollTo'];
  getCurrentPage: () => number;
  getPageCount: () => number;
  getPageBlob: (
    index: number,
    options?: { scale?: number },
  ) => Promise<Blob | null>;
  getAllMarkData: () => ShapeDataType[][];
  setMarkData: (page: number, markData: ShapeDataType[]) => void;
  setAllMarkData: (markData: ShapeDataType[][]) => void;
  clearAllMarkData: () => void;
};

export interface PDFViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 页面之间的间距 */
  pageGap?: number;

  /** 最大缩放级别 */
  maxZoom?: number;

  /** 最小缩放级别 */
  minZoom?: number;

  /** 页面滚动事件 */
  onPageScroll?: React.UIEventHandler<HTMLDivElement>;

  /** 渲染自定义页面覆盖物 */
  renderPageCover?: (
    pageIndex: number,
    options: { viewport: PageViewport },
  ) => React.ReactNode;

  /** 空文件提示 */
  emptyTips?: React.ReactElement;

  /** 标注内容变化事件 */
  onMarkChange?: (page: number, markData: ShapeDataType[]) => void;
}

const PDFViewer = React.forwardRef<PDFViewerHandle, PDFViewerProps>(
  (props, pRef) => {
    const {
      className = '',
      pageGap = 24,
      maxZoom = 3,
      minZoom = -4,
      renderPageCover = ef,
      onMarkChange = ef,
      style,
      onPageScroll,
      children,
      emptyTips = defaultEmptyTips,
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

    const [zoom, setZoom, getZoom] = useGetState(0);

    const scale = 2 ** zoom;

    const [_this] = useState<{
      pdfDoc?: any;
      mousePositionBeforeWheel?: { x: number; y: number; zoom: number };
      zooming: boolean;
    }>({
      zooming: false,
    });

    useDebounceEffect(
      () => {
        _this.zooming = false;
      },
      [zoom],
      { wait: 500 },
    );

    const [renderRange, setRenderRange] = useState<[number, number]>([0, 0]);

    const [pages, setPages, getPages] = useGetState<any[]>([]);

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
      let pdfContent = file;
      if (pdfContent instanceof File) {
        pdfContent = await pdfContent.arrayBuffer();
      }
      if (pdfJs) {
        const pdfDoc = await pdfJs.getDocument(pdfContent).promise;
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
          setPages(allPages);
          const dom = pageContainerRef.current;
          if (dom) {
            dom.scrollTop = 0;
          }
        }
      }
    });
    const scrollTo = useMemoizedFn<PDFViewerHandle['scrollTo']>((...args) => {
      const dom = pageContainerRef.current;
      if (dom) dom.scrollTo(...args);
    });
    const getCurrentPage = useMemoizedFn<PDFViewerHandle['getCurrentPage']>(
      () => current,
    );
    const getPageCount = useMemoizedFn<PDFViewerHandle['getPageCount']>(
      () => getPages().length,
    );

    // 獲取頁面的圖片
    const getPageBlob = useMemoizedFn<PDFViewerHandle['getPageBlob']>(
      async (index, options = {}) => {
        const { scale = 2 } = options;
        const pages = getPages();
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
        _this.mousePositionBeforeWheel = undefined;
        updateRenderRange();
      },
      { wait: 280 },
    );

    useEventListener(
      'scroll',
      (ev) => {
        if (_this.zooming) {
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
        const zoom = getZoom();
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
          _this.zooming = true;
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
        } else {
          _this.mousePositionBeforeWheel = undefined;
        }
      },
      { target: pageContainerRef, passive: true },
    );

    useEventListener(
      'mousemove',
      () => {
        _this.mousePositionBeforeWheel = undefined;
      },
      { target: pageContainerRef },
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

    /* 工具栏 */
    const [toolbarLeftDom, setToolbarLeftDom] = useState<HTMLDivElement | null>(
      null,
    );
    const [toolbarRightDom, setToolbarRightDom] =
      useState<HTMLDivElement | null>(null);

    /* 绘图功能 */
    const [drawing, setDrawing] = useState(false);

    const [drawMode, setDrawMode] = useState<{
      shapeType: ShapeType;
      attr?: Record<string, any>;
    }>({
      shapeType: 'rectangle',
    });

    const [_painter] = useState<{
      refs: (PainterRef | null)[];
      // 绘图数据
      data: ShapeDataType[][];
    }>({
      refs: [],
      data: [],
    });
    useEffect(() => {
      _painter.refs.forEach((painter) => {
        if (painter) {
          if (drawing) {
            painter.draw(drawMode.shapeType, drawMode.attr);
          } else {
            painter.cancelDraw();
          }
        }
      });
    }, [drawing, drawMode]);

    const getAllMarkData = useMemoizedFn<PDFViewerHandle['getAllMarkData']>(
      () => _painter.data,
    );
    const setMarkData = useMemoizedFn<PDFViewerHandle['setMarkData']>(
      (pageIndex, data) => {
        const ref = _painter.refs[pageIndex];
        if (ref) {
          ref.clearShapes();
          ref.addShapes(data);
        }
        _painter.data[pageIndex] = data;
      },
    );
    const clearAllMarkData = useMemoizedFn<PDFViewerHandle['clearAllMarkData']>(
      () => {
        _painter.refs.forEach((ref, pageIndex) => {
          if (ref) {
            ref.clearShapes();
          }
        });
      },
    );
    const setAllMarkData = useMemoizedFn<PDFViewerHandle['setAllMarkData']>(
      (shapeDataList) => {
        clearAllMarkData();
        shapeDataList.forEach((shapeData, pageIndex) => {
          setMarkData(pageIndex, shapeData);
        });
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
      getAllMarkData,
      setMarkData,
      setAllMarkData,
      clearAllMarkData,
    }));

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
        <PDFToolbarContext.Provider
          value={useMemo(
            () => ({ toolbarRightDom, toolbarLeftDom }),
            [toolbarRightDom, toolbarLeftDom],
          )}
        >
          <div
            className={`${styles.root} ${className}`}
            style={{
              ...style,
            }}
            {...otherProps}
          >
            <PDFToolbar
              className={styles.toolbar}
              max={2 ** maxZoom}
              min={2 ** minZoom}
              leftRef={(dom) => {
                setToolbarLeftDom(dom);
              }}
              rightRef={(dom) => {
                setToolbarRightDom(dom);
              }}
            />
            <div
              ref={pageContainerRef}
              className={styles.pages}
              onScroll={onPageScroll}
              style={{
                // @ts-expect-error
                '--scale-factor': scale,
              }}
            >
              {viewports.length === 0 && emptyTips}
              {viewports.map((viewport, pageIndex) => {
                const shouldRender =
                  pageIndex >= renderRange[0] && pageIndex <= renderRange[1];
                return (
                  <div
                    key={pageIndex}
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
                          index={pageIndex}
                          zoom={zoom}
                          render={shouldRender}
                          style={{ width: '100%', height: '100%' }}
                        />
                        {/* 绘图 */}
                        <div className={styles.pageCover}>
                          <Painter
                            ref={(ref) => (_painter.refs[pageIndex] = ref)}
                            className={`${styles.painter} ${
                              drawing ? styles.drawing : ''
                            }`}
                            width={viewport.width}
                            height={viewport.height}
                            style={{ height: '100%' }}
                            defaultDrawMode={drawing ? drawMode : false}
                            onInit={() => {
                              const shapeData = _painter.data[pageIndex];
                              const ref = _painter.refs[pageIndex];
                              if (shapeData && ref) {
                                ref.addShapes(shapeData);
                                if (drawing) {
                                  ref.draw(drawMode.shapeType, drawMode.attr);
                                }
                              }
                            }}
                            onDataChange={() => {
                              const ref = _painter.refs[pageIndex];
                              if (ref) {
                                const shapes = ref.getShapes();
                                _painter.data[pageIndex] = shapes;
                                onMarkChange(pageIndex, shapes);
                              }
                            }}
                          />
                        </div>
                        <div className={styles.pageCover}>
                          {renderPageCover(pageIndex, { viewport })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 工具栏渲染 */}
            <PainterToolbar
              drawing={drawing}
              drawMode={drawMode}
              onDrawModeChange={(shapeType, attr) => {
                setDrawMode({
                  attr,
                  shapeType,
                });
                if (!drawing) {
                  setDrawing(true);
                }
              }}
              onDrawCancel={() => {
                setDrawing(false);
              }}
            />
            {children}
          </div>
        </PDFToolbarContext.Provider>
      </PDFViewerContext.Provider>
    );
  },
);
PDFViewer.displayName = 'PDFViewer';

export const usePdfViewerRef = () => useRef<PDFViewerHandle>(null);

export default PDFViewer;
