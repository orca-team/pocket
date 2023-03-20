import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import type { ShapeDataType, ShapeType } from '@orca-fe/painter';
import type { TooltipDataType } from './plugins/PDFTooltipPlugin/def';

export type MarkDataType = TooltipDataType | ShapeDataType;

export function isShapeData(value: any): value is ShapeDataType {
  // 这里暂时使用了简易的判断，不是 tooltip 类型，我就归为 ShapeDataType
  if (!!value && typeof value === 'object' && 'type' in value && value['type'] !== 'tooltip') {
    return true;
  }
  return false;
}

export function isTooltipData(value: any): value is TooltipDataType {
  if (!!value && typeof value === 'object' && value['type'] === 'tooltip') {
    return true;
  }
  return false;
}

/**
 * PDF 控制器
 * 用于控制 PDF 阅读器，进行基础操作
 */
export type PDFViewerHandle = {

  /** 加载文件，支持 url / 文件 / ArrayBuffer */
  load: (file: string | URL | File | ArrayBuffer, title?: string) => Promise<void>;

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
  getPageBlob: (index: number, options?: { scale?: number }) => Promise<Blob | null>;

  setTitle: (title: React.ReactNode) => void;

  // 以下方法原本来自 PDFPainterPlugin，但后来抽离了内置插件 PDFTooltipPlugin
  // 我仍希望保留一套接口，所以在这里调整了接口数据类型，合并了两者

  /** 获取所有标注内容 */
  getAllMarkData: () => MarkDataType[][];

  /** 设置某一页的标注内容 */
  setMarkData: (page: number, markData: MarkDataType[]) => void;

  /** 设置所有页面的标注内容 */
  setAllMarkData: (markData: MarkDataType[][]) => void;

  /** 清除所有页面的标注内容 */
  clearAllMarkData: () => void;

  /** 开始绘图 */
  drawMark: (shapeType: ShapeType, attr: Record<string, any>) => void;

  /** 开始添加（批注） */
  drawTooltip: () => void;

  /** 取消绘图 */
  cancelDraw: () => void;

  /** 取消所有选中 */
  cancelCheck: () => void;
};

export type PageViewport = {
  height: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  scale: number;
  transform: [number, number, number, number, number, number];
  viewBox: [number, number, number, number];
  width: number;
  rawDims: {
    pageHeight: number;
    pageWidth: number;
    pageX: number;
    pageY: number;
  };
};

export type RenderPageCoverFnType = (pageIndex: number, options: { viewport: PageViewport; zoom: number }) => React.ReactNode;

export type PDFViewerContextType = {
  pages: any[];
  current: number;
  zoom: number;
  pdfViewer: PDFViewerHandle;
  forceUpdate: () => void;
  pageCoverRefs: (HTMLDivElement | null)[];
  viewports: PageViewport[];
};

const PDFViewerContext = React.createContext<PDFViewerContextType>({
  pages: [],
  viewports: [],
  current: 1,
  zoom: 0,
  forceUpdate: () => {},
  pageCoverRefs: [],
  pdfViewer: {
    async load() {},
    async close() {},
    changePage() {},
    getZoom() {
      return 0;
    },
    clearAllMarkData() {},
    getAllMarkData() {
      return [];
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
    setAllMarkData() {},
    setMarkData() {},
    setZoom() {},
    setTitle() {},
    cancelCheck() {},
    drawTooltip() {},
    drawMark() {},
    cancelDraw() {},
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
  const { pageCoverRefs, viewports, zoom } = useContext(PDFViewerContext);

  return (callback: RenderPageCoverFnType) =>
    pageCoverRefs.map((dom, pageIndex) => {
      const node = callback(pageIndex, {
        viewport: viewports[pageIndex],
        zoom,
      });
      if (!dom) return null;
      return <React.Fragment key={pageIndex}>{ReactDOM.createPortal(node, dom)}</React.Fragment>;
    });
}
