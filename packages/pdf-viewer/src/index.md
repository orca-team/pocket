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

<code src="../demo/Demo2.tsx" ></code>

<code src="../demo/Demo3.tsx" ></code>

## API

### 重要更新

- `0.4.4`
  - 将内置的绘图插件和批注插件导出
  - 支持主动关闭内置插件
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

| 属性名称              | 描述                                                                                                                    | 类型                                                                                        | 默认值        | 版本    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------- | ------- |
| pageGap               | 页面间距                                                                                                                | `number`                                                                                    | `24`          |         |
| maxZoom               | 最大缩放级别                                                                                                            | `number`                                                                                    | `3`           |         |
| minZoom               | 最小缩放级别                                                                                                            | `number`                                                                                    | `-4`          |         |
| renderPageCover       | 渲染自定义的页面覆盖内容                                                                                                | `(pageIndex: number, options: { viewport: PageViewport, zoom: number }) => React.ReactNode` | `-`           |         |
| onPageScroll          | 页面渲染事件                                                                                                            | `typeof onScroll`                                                                           | `-`           |         |
| emptyTips             | 未打开文件时的提示                                                                                                      | `ReactElement`                                                                              | `-`           | `0.0.4` |
| onMarkChange          | 标注内容变化事件                                                                                                        | `(page: number, markData: ShapeDataType[]) => void`                                         | `-`           | `0.0.5` |
| defaultTitle          | 默认展示的文件标题                                                                                                      | `string`                                                                                    | `-`           | `0.2.0` |
| title                 | 文件标题，当传入该属性时，`defaultTitle` 以及 `PDFViewerHandle.load` 和 `PDFViewerHandle.setTitle` 的设置标题都不生效。 | `string`                                                                                    | `-`           | `0.2.0` |
| defaultZoom           | 默认缩放级别                                                                                                            | `number` / `'autoWidth'` / `'authHeight'`                                                   | `'autoWidth'` | `0.4.0` |
| disabledPluginPainter | 禁用内置的绘图插件                                                                                                      | `boolean`                                                                                   | `false`       | `0.4.4` |
| disabledPluginTooltip | 禁用内置的批注插件                                                                                                      | `boolean`                                                                                   | `false`       | `0.4.4` |

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

## API - PDFTooltipPlugin

`0.4.4`

批注插件，用于在 PDF 的页面上添加文本批注

### 属性

| 属性名称 | 描述                                                                                     | 类型         | 默认值 | 版本 |
| -------- | ---------------------------------------------------------------------------------------- | ------------ | ------ | ---- |
| onCheck  | 批注选中事件（这是一个内部事件，后面可能会有较大调整）                                   | `() => void` | `-`    |      |
| onDraw   | 添加批注事件，当完成一个批注的添加、修改时触发（这是一个内部事件，后面可能会有较大调整） | `() => void` | `-`    |      |

### PDFPainterPluginHandle

使用 `ref` 以获得 `PDFPainterPluginHandle`。

| 方法名称            | 描述                   | 类型                                                  | 版本 |
| ------------------- | ---------------------- | ----------------------------------------------------- | ---- |
| getAllTooltipData   | 获取所有批注内容       | `() => TooltipDataType[][]`                           |      |
| setTooltipData      | 设置某一页的批注内容   | `(page: number, markData: TooltipDataType[]) => void` |      |
| setAllTooltipData   | 设置所有页面的批注内容 | `(markData: TooltipDataType[][]) => void`             |      |
| clearAllTooltipData | 清除所有页面的批注内容 | `() => void`                                          |      |
| drawTooltip         | 开始绘制批注           | `(attr?: Record<string, any>) => void`                |      |
| cancelDraw          | 取消绘图               | `() => void`                                          |      |
| cancelCheck         | 取消所有选中           | `() => void`                                          |      |

## API - PDFPainterPlugin

绘图插件，用于在 PDF 的页面上绘图

### 属性

`0.4.4`

| 属性名称     | 描述                                                                         | 类型                                                | 默认值 | 版本 |
| ------------ | ---------------------------------------------------------------------------- | --------------------------------------------------- | ------ | ---- |
| onCheck      | 绘图选中（这是一个内部事件，后面可能会有较大调整）                           | `(index:number) => void`                            | `-`    |      |
| onMarkChange | 绘图完成事件，绘图添加、修改时触发（这是一个内部事件，后面可能会有较大调整） | `(page: number, markData: ShapeDataType[]) => void` | `-`    |      |

### PDFPainterPluginHandle

| 方法名称         | 描述                   | 类型                                                        | 版本 |
| ---------------- | ---------------------- | ----------------------------------------------------------- | ---- |
| getAllMarkData   | 获取所有标注内容       | `() => ShapeDataType[][]`                                   |      |
| setMarkData      | 设置某一页的标注内容   | `(page: number, markData: ShapeDataType[]) => void`         |      |
| setAllMarkData   | 设置所有页面的标注内容 | `(markData: ShapeDataType[][]) => void`                     |      |
| clearAllMarkData | 清除所有页面的标注内容 | `() => void`                                                |      |
| drawMark         | 开始绘图               | `(shapeType: ShapeType, attr: Record<string, any>) => void` |      |
| cancelDraw       | 取消绘图               | `() => void`                                                |      |
| cancelCheck      | 取消所有选中           | `() => void`                                                |      |
