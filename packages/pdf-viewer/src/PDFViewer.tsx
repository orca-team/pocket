/* eslint-disable @typescript-eslint/no-explicit-any */
import { clamp, roundBy } from '@orca-fe/tools';
import { useCounter, useDebounceEffect, useDebounceFn, useEventListener, useMemoizedFn, useSetState } from 'ahooks';
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useGetState, useSizeListener } from '@orca-fe/hooks';
import cn from 'classnames';
import type { PDFDocumentProxy } from '@orca-fe/pdfjs-dist-browserify';
import { getDocument } from '@orca-fe/pdfjs-dist-browserify';
import * as pdfjsWorker from '@orca-fe/pdfjs-dist-browserify/build/pdf.worker';
import type { DocumentInitParameters } from '@orca-fe/pdfjs-dist-browserify/types/src/display/api';
import { ContextMenu } from '@orca-fe/pocket';
import { saveAs } from 'file-saver';
import { DownloadOutlined } from '@ant-design/icons';
import type { PageViewport, PDFViewerHandle, RenderPageCoverFnType, PDFViewerInternalStateType, SourceType } from './context';
import PDFViewerContext, { PDFToolbarContext } from './context';
import PDFPage from './PDFPage';
import { findSortedArr } from './utils';
import ZoomAndPageController from './ZoomAndPageController';
import PDFToolbar from './PDFToolbar';
import useStyle from './PDFViewer.style';
import type { LocaleType } from './locale/context';
import { LocaleContext, useLocale } from './locale/context';
import zhCN from './locale/zh_CN';

const ef = () => undefined;

const round001 = roundBy(0.001);

const DefaultLoadingTips = () => {
  const [l] = useLocale(zhCN);
  return <div className="pdf-viewer-default-loading-tips">{l.loadingTips}</div>;
};

const DefaultEmptyTips = () => {
  const [l] = useLocale(zhCN);
  return <div className="pdf-viewer-default-empty-tips">{l.loadTips}</div>;
};

export interface PDFViewerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {

  /** 默认缩放级别 */
  defaultZoom?: number | 'autoWidth' | 'autoHeight';

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

  /** 页面变化事件 */
  onPageChange?: (page: number) => void;

  /** 渲染自定义页面覆盖物 */
  renderPageCover?: RenderPageCoverFnType;

  /** 空文件提示 */
  emptyTips?: React.ReactElement;

  /** 自定义加载过程提示 */
  loadingTips?: React.ReactElement;

  /** 隐藏工具栏 */
  hideToolbar?: boolean;

  /** 缩放事件 */
  onZoomChange?: (zoom: number) => void;

  /** 是否支持拖拽打开文件 */
  dropFile?: boolean;

  pdfJsParams?: DocumentInitParameters;

  locale?: LocaleType;

  outputScale?: number;
}

const PDFViewer = React.forwardRef<PDFViewerHandle, PDFViewerProps>((props, pRef) => {
  const {
    className = '',
    pageGap = 24,
    maxZoom = 3,
    minZoom = -4,
    renderPageCover = ef,
    onZoomChange = ef,
    onPageScroll,
    children,
    emptyTips = <DefaultEmptyTips />,
    loadingTips = <DefaultLoadingTips />,
    title: _title,
    hideToolbar,
    defaultTitle,
    defaultZoom = 'autoWidth',
    dropFile,
    pdfJsParams,
    onPageChange = ef,
    locale,
    outputScale,
    ...otherProps
  } = props;

  useEffect(() => {
    if (!window['pdfjsWorker']) {
      window['pdfjsWorker'] = pdfjsWorker;
    }
  }, []);

  const styles = useStyle();

  // 最外层的根节点
  const rootRef = useRef<HTMLDivElement>(null);
  // 包裹页面部分的 body（带滚动条）
  const [bodyRef, setBodyRef] = useState<HTMLDivElement | null>(null);

  // 页面容器（随页面长度）
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const [current, setCurrent, getCurrent] = useGetState(0);

  const [zoom, setZoom, getZoom] = useGetState(typeof defaultZoom === 'number' ? defaultZoom : 0);

  const [__title, setTitle] = useState<React.ReactNode>(defaultTitle);

  const title = _title ?? __title;

  const scale = 2 ** zoom;

  const [_this] = useState<{
    pdfLoadingKey?: string;
    pdfDoc?: PDFDocumentProxy;
    mousePositionBeforeWheel?: {
      x: number;
      y: number;
      zoom: number;
    };
    zooming: boolean;
    size?: {
      width: number;
      height: number;
    };
    file?: SourceType;
  }>({
    zooming: false,
  });

  useEffect(() => {
    onPageChange(current);
  }, [current]);

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

  const [pluginLoading, { inc: pluginLoad, dec: pluginLoaded }] = useCounter(0);

  const setZoomWithScrollLock = useMemoizedFn((newZoom: number) => {
    const zoom = getZoom();
    if (newZoom === zoom) return;
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
      onZoomChange(newZoom);
    }
  });

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
  const {
    topArr: pageTopArr,
    maxWidth,
    pageMaxWidth,
    pageMaxHeight,
  } = useMemo(() => {
    let top = 0;
    let maxWidth = 0;
    let pageMaxWidth = 0;
    let pageMaxHeight = 0;
    const topArr = viewports.map(({ height, width }) => {
      const _top = top;
      top += Math.floor(height + pageGap) * scale;
      maxWidth = Math.max(width * scale, maxWidth);
      pageMaxWidth = Math.max(width, pageMaxWidth);
      pageMaxHeight = Math.max(height, pageMaxHeight);
      return _top;
    });
    return { topArr, maxWidth, pageMaxWidth, pageMaxHeight };
  }, [viewports, pageGap, scale]);

  const [zoomMode, setZoomMode] = useState<false | 'autoWidth' | 'autoHeight'>(typeof defaultZoom === 'number' ? false : defaultZoom);

  const autoZoomDebounce = useDebounceFn(
    () => {
      let newZoom = zoom;
      if (zoomMode && _this.size && maxWidth && pageMaxHeight) {
        if (zoomMode === 'autoWidth') {
          // 调整缩放级别，使其与容器宽度匹配
          newZoom = Math.log2((_this.size.width - 32) / pageMaxWidth);
        } else if (zoomMode === 'autoHeight') {
          newZoom = Math.log2((_this.size.height - 32) / pageMaxHeight);
        }
      }

      newZoom = round001(clamp(newZoom, -4, 3));
      if (newZoom !== zoom) {
        setZoomWithScrollLock(newZoom);
      }
    },
    { wait: 250 },
  );

  useEffect(() => {
    autoZoomDebounce.run();
  }, [zoomMode, pageMaxHeight, pageMaxWidth]);

  // 自动调整缩放级别
  useSizeListener((size) => {
    if (size.width === 0 || size.height === 0) {
      autoZoomDebounce.cancel();
      return;
    }

    _this.size = size;

    autoZoomDebounce.run();
  }, rootRef);

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

  const getPDFInstance = useMemoizedFn<PDFViewerHandle['getPDFInstance']>(() => _this.pdfDoc);
  const getFileSource = useMemoizedFn<PDFViewerHandle['getFileSource']>(() => _this.file);
  const close = useMemoizedFn<PDFViewerHandle['close']>(async () => {
    if (_this.pdfDoc) {
      try {
        _this.pdfLoadingKey = undefined;
        await _this.pdfDoc.destroy();
        setLoading(false);
        setTitle(undefined);
      } catch (err) {
        console.error('pdfDoc destory failed');
      }
    }
    _this.file = undefined;
    _this.pdfDoc = undefined;
    setPages([]);
  });
  const load = useMemoizedFn<PDFViewerHandle['load']>(async (file, _options = {}) => {
    const options = typeof _options === 'string' ? { title: _options } : _options;
    const { title, resetScrollTop = true } = options || {};

    const key = `${Date.now()}_${Math.random()}`;
    _this.pdfLoadingKey = key;
    setLoading(true);

    try {
      let pdfContent = file;
      if (pdfContent instanceof Promise) {
        pdfContent = await pdfContent;
      }
      if (pdfContent instanceof Blob) {
        pdfContent = await pdfContent.arrayBuffer();
      }

      // key 不一致，说明已经有更新的 load 请求。
      if (key !== _this.pdfLoadingKey) return;

      const pdfJsGetDocumentParams: DocumentInitParameters = {
        enableXfa: true,
        ...pdfJsParams,
      };
      if (typeof pdfContent === 'string' || pdfContent instanceof URL) {
        pdfJsGetDocumentParams.url = pdfContent;
      } else {
        pdfJsGetDocumentParams.data = pdfContent;
      }
      const pdfDoc = await getDocument(pdfJsGetDocumentParams).promise;
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
        if (key !== _this.pdfLoadingKey) return;
        setPages(allPages);
        _this.file = pdfContent;
        if (title != null) {
          setTitle(title);
        }
        const dom = pageContainerRef.current;
        if (dom && resetScrollTop) {
          dom.scrollTop = 0;
        }
      }
    } finally {
      if (_this.pdfLoadingKey === key) setLoading(false);
    }
    // 總頁數
  });
  const scrollTo = useMemoizedFn<PDFViewerHandle['scrollTo']>((...args) => {
    const dom = pageContainerRef.current;
    if (dom) dom.scrollTo(...args);
  });
  const getCurrentPage = useMemoizedFn<PDFViewerHandle['getCurrentPage']>(() => getCurrent());
  const getPageCount = useMemoizedFn<PDFViewerHandle['getPageCount']>(() => getPages().length);
  const getRoot = useMemoizedFn<PDFViewerHandle['getRoot']>(() => rootRef.current);

  // 獲取頁面的圖片
  const getPageBlob = useMemoizedFn<PDFViewerHandle['getPageBlob']>(async (index, options = {}) => {
    const { scale = 1, outputScale = 2 } = options;
    const pages = getPages();
    if (index < 0 || index >= pages.length) return null;
    const canvas = document.createElement('canvas');
    document.body.append(canvas);
    try {
      canvas.style.display = 'none';
      const page = pages[index];
      const viewport = page.getViewport({
        scale,
      });
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        const task = page.render({
          canvasContext: context,
          viewport,
          transform: [outputScale, 0, 0, outputScale, 0, 0],
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
  });

  const updateRenderRange = useMemoizedFn(() => {
    const dom = pageContainerRef.current;
    if (dom) {
      const top = dom.scrollTop;
      const height = dom.clientHeight;

      const currentPage = Math.max(findSortedArr(pageTopArr, top + 0.5 * height) - 1, 0);
      let startPage = findSortedArr(pageTopArr, top - 50);
      startPage = Math.max(0, startPage - 1);
      let pageBottom = pageTopArr[startPage];
      let endPage = startPage;
      while (viewports[endPage] && pageBottom + viewports[endPage].height * scale <= top + height + 50) {
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

  const downloadPdf = useMemoizedFn(async () => {
    const doc = _this.pdfDoc;
    if (doc) {
      const data = await doc.getData();
      const blob = new Blob([data.buffer], { type: 'application/pdf' });
      let fileTitle = typeof title === 'string' ? title : 'download.pdf';
      if (!fileTitle.endsWith('.pdf')) fileTitle += '.pdf';
      const file = new File([blob], fileTitle, { type: 'application/pdf' });
      saveAs(file, fileTitle);
    }
  });

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
            x: x + dom.scrollLeft - 0.5 * (maxWidth < width ? width - maxWidth : 0),
            y: y + dom.scrollTop,
            zoom,
          };
        }

        const newZoom = round001(clamp(zoom - clamp(ev.deltaY, -40, 40) * 0.01, minZoom, maxZoom));
        if (newZoom === zoom) return;
        _this.zooming = true;
        setZoomMode(false);
        setZoom(newZoom);
        if (_this.mousePositionBeforeWheel) {
          // 更新滾動條高度
          const { x: fullScrollLeft, y: fullScrollTop, zoom: originZoom } = _this.mousePositionBeforeWheel;
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
        onZoomChange(newZoom);
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

  // 拖拽并打开文件
  useEventListener(
    'dragenter',
    (ev) => {
      (ev.currentTarget as HTMLElement).setAttribute('over', '1');
    },
    { target: bodyRef },
  );
  useEventListener(
    'dragleave',
    (ev) => {
      (ev.currentTarget as HTMLElement).removeAttribute('over');
    },
    { target: bodyRef },
  );
  useEventListener(
    'dragover',
    (ev) => {
      if (dropFile) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    },
    { target: bodyRef },
  );
  useEventListener(
    'drop',
    (ev) => {
      (ev.currentTarget as HTMLElement).removeAttribute('over');
      if (dropFile) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.dataTransfer) {
          const { files } = ev.dataTransfer;
          if (files.length > 0) {
            const [file] = files;
            if (file.name.endsWith('.pdf')) load(file);
          }
        }
      }
    },
    { target: bodyRef },
  );

  /* 工具栏 */
  const [toolbarLeftDom, setToolbarLeftDom] = useState<HTMLDivElement | null>(null);
  const [toolbarRightDom, setToolbarRightDom] = useState<HTMLDivElement | null>(null);
  const [_centerToolbarIds, setCenterToolbarIds] = useState<[string, number][]>([]);

  const centerToolbarIds = useMemo(() => _centerToolbarIds.map(([id]) => id), [_centerToolbarIds]);
  const addCenterToolbarId = useMemoizedFn((id: string, order = 0) => {
    // 插入 toolbar id 并排序
    setCenterToolbarIds(ids =>
      ids
        .filter(([_id]) => _id !== id)
        .concat([[id, order]])
        .sort((a, b) => a[1] - b[1]),
    );
  });

  const removeCenterToolbarId = useMemoizedFn((id: string) => {
    setCenterToolbarIds(ids => ids.filter(([_id]) => _id !== id));
  });

  const pdfViewerHandle = useMemo<PDFViewerHandle>(
    () => ({
      load,
      close,
      setZoom: setZoomWithScrollLock,
      getZoom,
      changePage,
      getPageBlob,
      getCurrentPage,
      getPageCount,
      scrollTo,
      setTitle,
      getRoot,
      getFileSource,
      getPDFInstance,
      pluginLoad,
      pluginLoaded,
    }),
    [],
  );
  useImperativeHandle(pRef, () => pdfViewerHandle, []);

  const [pageCoverRefs, setPageCoverRefs] = useState<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    setPageCoverRefs(l => l.slice());
  }, [renderRange[0], renderRange[1]]);

  // 内部共享状态
  const [internalState, setInternalState] = useSetState<PDFViewerInternalStateType>(() => ({
    drawingPluginName: '',
  }));

  return (
    <LocaleContext.Provider value={useLocale(zhCN, locale)[0]}>
      <PDFViewerContext.Provider
        value={useMemo(
          () => ({
            loading,
            pluginLoading,
            pages,
            viewports,
            zoom,
            current,
            changePage,
            forceUpdate,
            pageCoverRefs,
            pdfViewer: pdfViewerHandle,
            internalState,
            setInternalState,
            bodyElement: bodyRef,
          }),
          [loading, pluginLoading, pages, viewports, zoom, current, pageCoverRefs, internalState, bodyRef],
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
          <div ref={rootRef} className={`${styles.root} ${className}`} {...otherProps}>
            <PDFToolbar
              hide={hideToolbar}
              title={loading ? '' : title}
              className={styles.toolbar}
              leftRef={(dom) => {
                setToolbarLeftDom(dom);
              }}
              centerIds={centerToolbarIds}
              rightRef={(dom) => {
                setToolbarRightDom(dom);
              }}
            />
            <div ref={setBodyRef} className={cn(styles.pagesOuter, { [styles.droppable]: dropFile })}>
              <ContextMenu
                ref={pageContainerRef}
                className={styles.pages}
                onScroll={onPageScroll}
                mainMenuMinWidth={200}
                data={[
                  {
                    key: 'download',
                    icon: <DownloadOutlined />,
                    text: '下载当前文档',
                    disabled: pages.length <= 0,
                  },
                ]}
                onMenuClick={(menu) => {
                  if (menu.key === 'download') {
                    downloadPdf();
                  }
                }}
                style={{
                  '--scale-factor': scale,
                  '--pdf-viewer-page-scale': scale,
                }}
              >
                {viewports.length === 0 && !loading && !pluginLoading && emptyTips}
                {viewports.map((viewport, pageIndex) => {
                  const shouldRender = pageIndex >= renderRange[0] && pageIndex <= renderRange[1];
                  const width = `calc(var(--scale-factor) * ${Math.floor(viewport.width)}px)`;
                  const height = `calc(var(--scale-factor) * ${Math.floor(viewport.height)}px)`;
                  const gap = `calc(var(--scale-factor) * ${pageGap}px)`;
                  return (
                    <div key={pageIndex} className={styles.pageContainer} style={{ width, height, marginBottom: gap }}>
                      {shouldRender && (
                        <>
                          <PDFPage className={styles.page} outputScale={outputScale} index={pageIndex} zoom={zoom} render={shouldRender} />
                          <div ref={node => (pageCoverRefs[pageIndex] = node)} className={styles.pageCover} />
                          <div className={styles.pageCover}>{renderPageCover(pageIndex, { viewport, zoom })}</div>
                        </>
                      )}
                    </div>
                  );
                })}
              </ContextMenu>
              {(loading || !!pluginLoading) && loadingTips}

              {/* 绘图的工具栏渲染 */}
              {children}
            </div>

            {/* 页码 */}
            {pages.length > 0 && (
              <ZoomAndPageController
                className={styles.pageController}
                max={2 ** maxZoom}
                min={2 ** minZoom}
                zoomMode={zoomMode}
                onZoomModeChange={setZoomMode}
              />
            )}
          </div>
        </PDFToolbarContext.Provider>
      </PDFViewerContext.Provider>
    </LocaleContext.Provider>
  );
});

PDFViewer.displayName = 'PDFViewer';

export const usePdfViewerRef = () => useRef<PDFViewerHandle>(null);

export default PDFViewer;
