/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-function */
import React from 'react';

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
};

const PDFViewerContext = React.createContext<PDFViewerContextType>({
  pages: [],
  current: 1,
  zoom: 0,
  setZoom: () => {},
  changePage: () => {},
});

export default PDFViewerContext;

export type PDFToolbarContextType = {
  getToolbarLeftDom: () => HTMLDivElement | null;
  getToolbarRightDom: () => HTMLDivElement | null;
};

export const PDFToolbarContext = React.createContext<PDFToolbarContextType>({
  getToolbarLeftDom: () => null,
  getToolbarRightDom: () => null,
});
