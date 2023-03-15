/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-function */
import React from 'react';
import type { ShapeDataType } from '@orca-fe/painter';

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

export type PDFViewerContextType = {
  pages: any[];
  current: number;
  zoom: number;
  setZoom: (zoom: number) => void;
  changePage: (page: number, anim?: boolean) => void;
  pdfViewer: PDFViewerHandle;
};

const PDFViewerContext = React.createContext<PDFViewerContextType>({
  pages: [],
  current: 1,
  zoom: 0,
  setZoom: () => {},
  changePage: () => {},
  pdfViewer: {
    async load() {},
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
  },
});

export default PDFViewerContext;

export type PDFToolbarContextType = {
  toolbarLeftDom: HTMLDivElement | null;
  toolbarRightDom: HTMLDivElement | null;
};

export const PDFToolbarContext = React.createContext<PDFToolbarContextType>({
  toolbarLeftDom: null,
  toolbarRightDom: null,
});
