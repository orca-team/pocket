import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import type { SetState } from 'ahooks/es/useSetState';
import type { PageViewport, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

export type SourceType = string | URL | ArrayBuffer;

export type LoadOptions = {
  title?: string;
  resetScrollTop?: boolean;
};

/**
 * PDF 控制器
 * 用于控制 PDF 阅读器，进行基础操作
 */
export type PDFViewerHandle = {

  /** 加载文件，支持 url / 文件 / ArrayBuffer */
  load: (file: Promise<SourceType | Blob> | SourceType | Blob, options?: LoadOptions) => Promise<void>;

  /** 关闭文件，恢复初始状态 */
  close: () => Promise<void>;

  /** 设置当前的缩放级别 */
  setZoom: (zoom: number) => void;

  /** 获取当前的缩放级别 */
  getZoom: () => number;

  /** 翻页 */
  changePage: (pageIndex: number, anim?: boolean) => void;

  /** 滚动到制定高度 */
  scrollTo: Element['scrollTo'];

  /** 获取当前页码 */
  getCurrentPage: () => number;

  /** 获取总页数 */
  getPageCount: () => number;

  /** 获取某一页的 PDF 图像内容（Blob） */
  getPageBlob: (
    index: number,
    options?: {
      scale?: number;
      outputScale?: number;
    },
  ) => Promise<Blob | null>;

  setTitle: (title: React.ReactNode) => void;

  getRoot: () => HTMLElement | null;

  getFileSource: () => SourceType | null | undefined;

  getPDFInstance: () => PDFDocumentProxy | undefined;
  pluginLoad: () => void;
  pluginLoaded: () => void;
};

// export type PageViewport = {
//   height: number;
//   offsetX: number;
//   offsetY: number;
//   rotation: number;
//   scale: number;
//   transform: [number, number, number, number, number, number];
//   viewBox: [number, number, number, number];
//   width: number;
//   rawDims: {
//     pageHeight: number;
//     pageWidth: number;
//     pageX: number;
//     pageY: number;
//   };
// };

export type RenderPageCoverFnType = (
  pageIndex: number,
  options: {
    viewport: PageViewport;
    zoom: number;
  },
) => React.ReactNode;

// PDF 组件内置状态
export type PDFViewerInternalStateType = Record<string, any> & {
  // 用于共享（互斥）组件之间的绘制状态
  drawingPluginName: string;
};

export type PDFViewerContextType = {
  loading: boolean;
  pluginLoading: number;
  pages: PDFPageProxy[];
  current: number;
  zoom: number;
  pdfViewer: PDFViewerHandle;
  forceUpdate: () => void;
  pageCoverRefs: (HTMLDivElement | null)[];
  bodyElement: HTMLDivElement | null;
  viewports: PageViewport[];
  internalState: PDFViewerInternalStateType;
  setInternalState: SetState<PDFViewerInternalStateType>;

  // 注册菜单采集器事件
  onMenuCollect: (callback: (...args: any[]) => any) => void;
  // 卸载菜单采集器事件
  offMenuCollect: (callback: (...args: any[]) => any) => void;
};

const PDFViewerContext = React.createContext<PDFViewerContextType>({
  loading: false,
  pluginLoading: 0,
  pages: [],
  viewports: [],
  current: 1,
  zoom: 0,
  forceUpdate: () => {},
  pageCoverRefs: [],
  internalState: {
    drawingPluginName: '',
  },
  bodyElement: null,
  setInternalState: () => {},
  onMenuCollect: () => {},
  offMenuCollect: () => {},
  pdfViewer: {
    async load() {},
    async close() {},
    getFileSource() {
      return null;
    },
    getPDFInstance() {
      return undefined;
    },
    changePage() {},
    getZoom() {
      return 0;
    },
    async getPageBlob() {
      return null;
    },
    getCurrentPage() {
      return 0;
    },
    getPageCount() {
      return 0;
    },
    scrollTo() {},
    setZoom() {},
    setTitle() {},
    getRoot: () => null,
    pluginLoad() {},
    pluginLoaded() {},
  },
});

export default PDFViewerContext;

export type PDFToolbarContextType = {
  toolbarLeftDom: HTMLDivElement | null;
  toolbarRightDom: HTMLDivElement | null;
  addCenterToolbarId: (id: string, order?: number) => void;
  removeCenterToolbarId: (id: string) => void;
  centerToolbarIds: string[];
};

export const PDFToolbarContext = React.createContext<PDFToolbarContextType>({
  toolbarLeftDom: null,
  toolbarRightDom: null,
  addCenterToolbarId: () => undefined,
  removeCenterToolbarId: () => undefined,
  centerToolbarIds: [],
});

export function usePageCoverRenderer() {
  const { pageCoverRefs, viewports, zoom, loading } = useContext(PDFViewerContext);

  return (callback: RenderPageCoverFnType) =>
    pageCoverRefs.map((dom, pageIndex) => {
      if (loading) return null;
      if (!dom) return null;
      const viewport = viewports[pageIndex];
      if (!viewport) return null;
      const node = callback(pageIndex, { viewport, zoom });
      return <React.Fragment key={pageIndex}>{ReactDOM.createPortal(node, dom)}</React.Fragment>;
    });
}
