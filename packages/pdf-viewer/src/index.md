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

`npm i @orca-fe/pdf-viewer***REMOVED***`

`yarn add @orca-fe/pdf-viewer***REMOVED***`

## 功能简介

基于 [pdf.js](https://github.com/mozilla/pdf.js/) 封装的 PDF 阅读器。提供了接口，允许你在每一页上渲染自己需要的内容。

## 示例

### 基础用法

<code src="../demo/DemoDev.tsx" ></code>

<code src="../demo/Demo1.tsx" ></code>

<code src="../demo/Demo2.tsx" ></code>

<code src="../demo/Demo3.tsx" ></code>

## API

### 重要更新

- `0.4.0`
  - 支持自动宽度/高度
- `0.3.0`
  - 重构了插件机制，提升了插件的独立性
  - 增加了批注组件以及组件的属性编辑功能
- `0.2.0`
  - 支持通过属性 `defaultTitle`, `title`，设置文件标题。
  - `PDFViewerHandle.setTitle` 可以设置文件标题。
  - `PDFViewerHandle` 中，`load` 加载文件时，可以传入 `title` 来设置文件标题。

### 属性

| 属性名称        | 描述                                                                                                                    | 类型                                                                                        | 默认值        | 版本    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------- | ------- |
| pageGap         | 页面间距                                                                                                                | `number`                                                                                    | `24`          |         |
| maxZoom         | 最大缩放级别                                                                                                            | `number`                                                                                    | `3`           |         |
| minZoom         | 最小缩放级别                                                                                                            | `number`                                                                                    | `-4`          |         |
| renderPageCover | 渲染自定义的页面覆盖内容                                                                                                | `(pageIndex: number, options: { viewport: PageViewport, zoom: number }) => React.ReactNode` | `-`           |         |
| onPageScroll    | 页面渲染事件                                                                                                            | `typeof onScroll`                                                                           | `-`           |         |
| emptyTips       | 未打开文件时的提示                                                                                                      | `ReactElement`                                                                              | `-`           | `0.0.4` |
| onMarkChange    | 标注内容变化事件                                                                                                        | `(page: number, markData: ShapeDataType[]) => void`                                         | `-`           | `0.0.5` |
| defaultTitle    | 默认展示的文件标题                                                                                                      | `string`                                                                                    | `-`           | `0.2.0` |
| title           | 文件标题，当传入该属性时，`defaultTitle` 以及 `PDFViewerHandle.load` 和 `PDFViewerHandle.setTitle` 的设置标题都不生效。 | `string`                                                                                    | `-`           | `0.2.0` |
| defaultZoom     | 默认缩放级别                                                                                                            | `number` / `'autoWidth'` / `'authHeight'`                                                   | `'autoWidth'` | `0.4.0` |

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

| 方法名称         | 描述                             | 类型                                                              | 版本                      |
| ---------------- | -------------------------------- | ----------------------------------------------------------------- | ------------------------- |
| load             | 加载文件                         | `(file: ArrayBuffer, title?:string) => Promise<void>`             | `0.2.0` 增加 `title` 属性 |
| close            | 关闭文件                         | `() => void`                                                      | `0.1.0`                   |
| setZoom          | 设置缩放级别                     | `(zoom: number) => void`                                          |                           |
| getZoom          | 取得当前缩放级别                 | `() => number`                                                    |                           |
| changePage       | 翻页（从 0 开始）                | `(pageIndex: number, anim?: boolean) => void`                     |                           |
| scrollTo         | 控制页面滚动到特定未知           | 同 `HTMLElement.scrollTo`                                         |                           |
| getCurrentPage   | 获取当前窗口中的页码，从 0 开始  | `() => number`                                                    |                           |
| getPageCount     | 获取当前页面数量                 | `() => number`                                                    |                           |
| getPageBlob      | 获取页面的渲染信息（图片二进制） | `(index: number, options?: { scale?: number },) => Promise<Blob>` |                           |
| getAllMarkData   | 获取当前页面中所有的标注数据     | `() => ShapeDataType[][]`                                         | `0.0.5`                   |
| setMarkData      | 更新某一页的标注数据             | `(page: number, markData: ShapeDataType[]) => void`               | `0.0.5`                   |
| setAllMarkData   | 更新所有页面的标注数据           | `(markData: ShapeDataType[][]) => void`                           | `0.0.5`                   |
| clearAllMarkData | 清除所有页面的标注数据           | `() => void`                                                      | `0.0.6`                   |
| setTitle         | 设置文件标题                     | `(title: string) => void`                                         | `0.2.0`                   |
