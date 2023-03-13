---
title: PDF 阅读器 PdfViewer
nav:
  title: 重型组件
  path: /pro-component
group:
  title: PDF 阅读器 PdfViewer
  path: /pdf-viewer
---

# PDF 阅读器 PdfViewer

![npm](https://img.shields.io/npm/v/@orca-fe/pdf-viewer.svg)

`npm i @orca-fe/pdf-viewer --registry=https://registry-cnpm.dayu.work/`

`yarn add @orca-fe/pdf-viewer --registry=https://registry-cnpm.dayu.work/`

## 功能简介

基于 [pdf.js](https://github.com/mozilla/pdf.js/) 封装的 PDF 阅读器。提供了接口，允许你在每一页上渲染自己需要的内容。

## 示例

### 基础用法

<code src="../demo/DemoDev.tsx" ></code>

<code src="../demo/Demo1.tsx" ></code>

## API

### 属性

| 属性名称        | 描述                     | 类型                                                                          | 默认值 | 版本    |
| --------------- | ------------------------ | ----------------------------------------------------------------------------- | ------ | ------- |
| pageGap         | 页面间距                 | `number`                                                                      | `24`   |         |
| maxZoom         | 最大缩放级别             | `number`                                                                      | `3`    |         |
| minZoom         | 最小缩放级别             | `number`                                                                      | `-4`   |         |
| renderPageCover | 渲染自定义的页面覆盖内容 | `(pageIndex: number, options: { viewport: PageViewport }) => React.ReactNode` | `-`    |         |
| onPageScroll    | 页面渲染事件             | `typeof onScroll`                                                             | `-`    |         |
| emptyTips       | 未打开文件时的提示       | `ReactElement`                                                                | `-`    | `0.0.4` |
| onMarkChange    | 标注内容变化事件         | `(page: number, markData: ShapeDataType[]) => void`                           | `-`    | `0.0.5` |

### PDFViewerHandle

使用 `ref` 以获得 `PDFViewerHandle`。你可以通过 `usePdfViewerRef` 来获得更好的 `TypeScript` 提示

```tsx | pure
import PDFViewer, { usePdfViewerRef } from '@orca-fe/pdf-viewer';
export default () => {
  const pdfViewerRef = usePdfViewerRef();

  useEffect(() => {
    const pdfViewer = pdfViewerRef.current;

    // 取到 PDFViewerHandle
    if (pdfViewer) {
      // do something
      pdfViewer.load(/* ... */);
    }
  }, []);

  return <PDFViewer ref={pdfViewerRef} />;
};
```

| 方法名称       | 描述                             | 类型                                                              | 版本    |
| -------------- | -------------------------------- | ----------------------------------------------------------------- | ------- |
| load           | 加载文件                         | `(file: ArrayBuffer) => Promise<void>`                            |         |
| setZoom        | 设置缩放级别                     | `(zoom: number) => void`                                          |         |
| getZoom        | 取得当前缩放级别                 | `() => number`                                                    |         |
| changePage     | 翻页（从 0 开始）                | `(pageIndex: number, anim?: boolean) => void`                     |         |
| scrollTo       | 控制页面滚动到特定未知           | 同 `HTMLElement.scrollTo`                                         |         |
| getCurrentPage | 获取当前窗口中的页码，从 0 开始  | `() => number`                                                    |         |
| getPageCount   | 获取当前页面数量                 | `() => number`                                                    |         |
| getPageBlob    | 获取页面的渲染信息（图片二进制） | `(index: number, options?: { scale?: number },) => Promise<Blob>` |         |
| getAllMarkData | 获取当前页面中所有的标注数据     | `() => ShapeDataType[][]`                                         | `0.0.5` |
| setMarkData    | 更新某一页的标注数据             | `(page: number, markData: ShapeDataType[]) => void`               | `0.0.5` |
| setAllMarkData | 更新所有页面的标注数据           | `(markData: ShapeDataType[][]) => void`                           | `0.0.5` |
