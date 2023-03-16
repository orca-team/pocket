/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-function */
import React from 'react';
import type { ShapeDataType } from '@orca-fe/painter';

/**
 * PDF 控制器
 * 用于控制 PDF 阅读器，进行基础操作
 */
export type PDFViewerHandle = {
  /** 加载文件，支持 url / 文件 / ArrayBuffer */
  load: (
    file: string | URL | File | ArrayBuffer,
    title?: string,
  ) => Promise<void>;

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
    options?: { scale?: number },
  ) => Promise<Blob | null>;

  /** 获取所有标注内容 */
  getAllMarkData: () => ShapeDataType[][];

  /** 设置某一页的标注内容 */
  setMarkData: (page: number, markData: ShapeDataType[]) => void;

  /** 设置所有页面的标注内容 */
  setAllMarkData: (markData: ShapeDataType[][]) => void;

  /** 清除所有页面的标注内容 */
  clearAllMarkData: () => void;

  setTitle: (title: React.ReactNode) => void;
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

export type RenderPageCoverFnType = (
  pageIndex: number,
  options: { viewport: PageViewport; zoom: number },
) => React.ReactNode;

export type PDFViewerContextType = {
  pages: any[];
  current: number;
  zoom: number;
  pdfViewer: PDFViewerHandle;
  addRenderPageCoverFn: (fn: RenderPageCoverFnType) => void;
  removeRenderPageCoverFn: (fn: RenderPageCoverFnType) => void;
};

const PDFViewerContext = React.createContext<PDFViewerContextType>({
  pages: [],
  current: 1,
  zoom: 0,
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
  },
  addRenderPageCoverFn() {},
  removeRenderPageCoverFn() {},
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
