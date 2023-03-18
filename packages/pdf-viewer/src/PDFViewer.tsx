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
import type {
  PageViewport,
  PDFViewerHandle,
  RenderPageCoverFnType,
} from './context';
import PDFViewerContext, { PDFToolbarContext } from './context';
import PDFPage from './PDFPage';
import PDFToolbar from './PDFToolbar';
import useStyle from './PDFViewer.style';
import * as _pdfJS from '../pdfjs-build/pdf';
import * as pdfjsWorker from '../pdfjs-build/pdf.worker';
import { findSortedArr } from './utils';
import type {
  PainterToolbarProps,
  PDFPainterHandle,
} from './plugins/PDFPainterPlugin';
import PDFPainterPlugin from './plugins/PDFPainterPlugin';
import ZoomAndPageController from './ZoomAndPageController';
import PDFTooltipPlugin from './plugins/PDFTooltipPlugin';

const pdfJs: any = _pdfJS;

const ef = () => undefined;

const defaultLoadingTips = (
  <div className="pdf-viewer-default-empty-tips">正在打开文件...</div>
);

const defaultEmptyTips = (
  <div className="pdf-viewer-default-empty-tips">请打开一个 PDF 文件</div>
);

export interface PDFViewerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {

  /** 默认文件标题（非受控） */
  defaultTitle?: React.ReactNode;

  /** 文件标题（受控） */
  title?: React.ReactNode;

  /** 页面之间的间距 */
  pageGap?: number;

  /** 最大缩放级别 */
  maxZoom?: number;

  /** 最小缩放级别 */
  minZoom?: number;

  /** 页面滚动事件 */
  onPageScroll?: React.UIEventHandler<HTMLDivElement>;

  /** 渲染自定义页面覆盖物 */
  renderPageCover?: RenderPageCoverFnType;

  /** 空文件提示 */
  emptyTips?: React.ReactElement;

  /** 标注内容变化事件 */
  onMarkChange?: PainterToolbarProps['onMarkChange'];

  /** 隐藏工具栏 */
  hideToolbar?: boolean;
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
      onPageScroll,
      children,
      emptyTips = defaultEmptyTips,
      title: _title,
      hideToolbar,
      defaultTitle,
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

    const [__title, setTitle] = useState<React.ReactNode>(defaultTitle);

    const title = _title ?? __title;

    const scale = 2 ** zoom;

    const [_this] = useState<{
      pdfDoc?: any;
      mousePositionBeforeWheel?: { x: number; y: number; zoom: number };
      zooming: boolean;
    }>({
      zooming: false,
    });

    const [, setForceUpdateCount] = useState(0);
    const forceUpdate = useMemoizedFn(() => {
      setForceUpdateCount(count => count + 1);
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

    const [loading, setLoading] = useState(false);

    // 获取每一页的 viewport 信息
    const viewports = useMemo(
      () =>
        pages.map((page) => {
          const viewport = page.getViewport({ scale: 1 }) as PageViewport;
          return viewport;
        }),
      [pages],
    );

    // 根据 viewport 信息生成每一页的实际位置信息
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

    const close = useMemoizedFn<PDFViewerHandle['close']>(async () => {
      if (_this.pdfDoc) {
        try {
          await _this.pdfDoc.destroy();
        } catch (err) {
          console.error('pdfDoc destory failed');
        }
      }
      _this.pdfDoc = undefined;
      setPages([]);
    });
    const load = useMemoizedFn<PDFViewerHandle['load']>(async (file) => {
      let pdfContent = file;
      if (pdfContent instanceof File) {
        pdfContent = await pdfContent.arrayBuffer();
      }
      if (pdfJs) {
        setLoading(true);
        try {
          const pdfDoc = await pdfJs.getDocument(pdfContent).promise;
          if (pdfDoc) {
            _this.pdfDoc = pdfDoc;
            const pageLength = pdfDoc.numPages;
            const allPages = await Promise.all(
              new Array(pageLength).fill(0)
                .map(async (_, index) => {
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
        } finally {
          setLoading(false);
        }
        // 總頁數
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

    // 监听滚动事件，并更新需要展示的页面范围（虚拟列表）
    useEventListener(
      'scroll',
      (ev) => {
        if (_this.zooming) {
          // 如果是因为正在缩放导致的滚动，则需要添加防抖
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
          }
        } else {
          _this.mousePositionBeforeWheel = undefined;
        }
      },
      { target: pageContainerRef, passive: true },
    );

    // 鼠标发生移动，则清空 position 信息，避免后续缩放时出现异常
    useEventListener(
      'mousemove',
      () => {
        _this.mousePositionBeforeWheel = undefined;
      },
      { target: pageContainerRef },
    );

    // 禁用默认的滚轮缩放（缩放页面）
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
    const [centerToolbarIds, setCenterToolbarIds] = useState<string[]>([]);

    const addCenterToolbarId = useMemoizedFn((id: string) => {
      setCenterToolbarIds(ids => [...new Set([...ids, id])]);
    });

    const removeCenterToolbarId = useMemoizedFn((id: string) => {
      setCenterToolbarIds(ids => ids.filter(_id => _id !== id));
    });

    // 绘图功能
    const pdfPainterHandle = useRef<PDFPainterHandle>(null);

    const getAllMarkData = useMemoizedFn<PDFPainterHandle['getAllMarkData']>(
      (...args) => {
        const pdfPainter = pdfPainterHandle.current;
        if (pdfPainter) {
          return pdfPainter.getAllMarkData(...args);
        }
        return [];
      },
    );
    const setMarkData = useMemoizedFn<PDFPainterHandle['setMarkData']>(
      (...args) => {
        pdfPainterHandle.current?.setMarkData(...args);
      },
    );
    const setAllMarkData = useMemoizedFn<PDFPainterHandle['setAllMarkData']>(
      (...args) => {
        pdfPainterHandle.current?.setAllMarkData(...args);
      },
    );
    const clearAllMarkData = useMemoizedFn<
      PDFPainterHandle['clearAllMarkData']
    >((...args) => {
      pdfPainterHandle.current?.clearAllMarkData(...args);
    });
    const drawMark = useMemoizedFn<PDFPainterHandle['drawMark']>((...args) => {
      pdfPainterHandle.current?.drawMark(...args);
    });
    const cancelDraw = useMemoizedFn<PDFPainterHandle['cancelDraw']>(
      (...args) => {
        pdfPainterHandle.current?.cancelDraw(...args);
      },
    );

    const pdfViewerHandle = useMemo<PDFViewerHandle>(
      () => ({
        load,
        close,
        setZoom: setZoomForToolbar,
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
        setTitle,
        drawMark,
        cancelDraw,
      }),
      [],
    );
    useImperativeHandle(pRef, () => pdfViewerHandle);

    const [pageCoverRefs, setPageCoverRefs] = useState<
      (HTMLDivElement | null)[]
        >([]);
    useEffect(() => {
      setPageCoverRefs(l => l.slice());
    }, [renderRange[0], renderRange[1]]);

    return (
      <PDFViewerContext.Provider
        value={useMemo(
          () => ({
            pages,
            viewports,
            zoom,
            current,
            changePage,
            forceUpdate,
            pageCoverRefs,
            pdfViewer: pdfViewerHandle,
          }),
          [pages, viewports, zoom, current, pageCoverRefs],
        )}
      >
        <PDFToolbarContext.Provider
          value={useMemo(
            () => ({
              toolbarRightDom,
              toolbarLeftDom,
              removeCenterToolbarId,
              centerToolbarIds,
              addCenterToolbarId,
            }),
            [toolbarRightDom, toolbarLeftDom, centerToolbarIds],
          )}
        >
          <div className={`${styles.root} ${className}`} {...otherProps}>
            <PDFToolbar
              hide={hideToolbar}
              title={title}
              className={styles.toolbar}
              leftRef={(dom) => {
                setToolbarLeftDom(dom);
              }}
              centerIds={centerToolbarIds}
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
                '--pdf-viewer-page-scale': scale,
              }}
            >
              {viewports.length === 0 &&
                (loading ? defaultLoadingTips : emptyTips)}
              {viewports.map((viewport, pageIndex) => {
                const shouldRender =
                  pageIndex >= renderRange[0] && pageIndex <= renderRange[1];
                const width = `calc(var(--scale-factor) * ${Math.floor(
                  viewport.width,
                )}px)`;
                const height = `calc(var(--scale-factor) * ${Math.floor(
                  viewport.height,
                )}px)`;
                const gap = `calc(var(--scale-factor) * ${pageGap}px)`;
                return (
                  <div
                    key={pageIndex}
                    className={styles.pageContainer}
                    style={{ width, height, marginBottom: gap }}
                  >
                    {shouldRender && (
                      <>
                        <PDFPage
                          className={styles.page}
                          index={pageIndex}
                          zoom={zoom}
                          render={shouldRender}
                        />
                        <div
                          ref={node => (pageCoverRefs[pageIndex] = node)}
                          className={styles.pageCover}
                        />
                        <div className={styles.pageCover}>
                          {renderPageCover(pageIndex, { viewport, zoom })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* 绘图的工具栏渲染 */}
              {pages.length > 0 && (
                <>
                  <PDFPainterPlugin
                    ref={pdfPainterHandle}
                    onMarkChange={onMarkChange}
                  />
                  <PDFTooltipPlugin />
                </>
              )}
              {children}
            </div>

            {/* 页码 */}
            {pages.length > 0 && (
              <ZoomAndPageController
                className={styles.pageController}
                max={2 ** maxZoom}
                min={2 ** minZoom}
              />
            )}
          </div>
        </PDFToolbarContext.Provider>
      </PDFViewerContext.Provider>
    );
  },
);
PDFViewer.displayName = 'PDFViewer';

export const usePdfViewerRef = () => useRef<PDFViewerHandle>(null);

export default PDFViewer;
