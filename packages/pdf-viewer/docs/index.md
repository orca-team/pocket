---
nav:
  title: 重型组件
  path: /pro-component
title: PDF 阅读器 PdfViewer
---

# PDF 阅读器 PdfViewer

![npm](https://img.shields.io/npm/v/@orca-fe/pdf-viewer.svg)

`npm i @orca-fe/pdf-viewer`

`yarn add @orca-fe/pdf-viewer`

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

- `1.14.0`
  - 增加了国际化支持
- `1.0.0`
  - 移除了内置组件，改为通过插件机制来实现
- `0.4.5`
  - 增加 `onZoomChange` 事件
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

| 属性名称                                     | 描述                                                                                                                    | 类型                                                                                        | 默认值                                 | 版本     |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------- | -------- |
| pageGap                                      | 页面间距                                                                                                                | `number`                                                                                    | `24`                                   |          |
| maxZoom                                      | 最大缩放级别                                                                                                            | `number`                                                                                    | `3`                                    |          |
| minZoom                                      | 最小缩放级别                                                                                                            | `number`                                                                                    | `-4`                                   |          |
| renderPageCover                              | 渲染自定义的页面覆盖内容                                                                                                | `(pageIndex: number, options: { viewport: PageViewport, zoom: number }) => React.ReactNode` | `-`                                    |          |
| onPageScroll                                 | 页面渲染事件                                                                                                            | `typeof onScroll`                                                                           | `-`                                    |          |
| emptyTips                                    | 未打开文件时的提示                                                                                                      | `ReactElement`                                                                              | `-`                                    | `0.0.4`  |
| onMarkChange(deprecated at `1.0.0`)          | 标注内容变化事件                                                                                                        | `(page: number, markData: ShapeDataType[]) => void`                                         | `-`                                    | `0.0.5`  |
| defaultTitle                                 | 默认展示的文件标题                                                                                                      | `string`                                                                                    | `-`                                    | `0.2.0`  |
| title                                        | 文件标题，当传入该属性时，`defaultTitle` 以及 `PDFViewerHandle.load` 和 `PDFViewerHandle.setTitle` 的设置标题都不生效。 | `string`                                                                                    | `-`                                    | `0.2.0`  |
| defaultZoom                                  | 默认缩放级别                                                                                                            | `number` / `'autoWidth'` / `'authHeight'`                                                   | `'autoWidth'`                          | `0.4.0`  |
| disabledPluginPainter(deprecated at `1.0.0`) | 禁用内置的绘图插件                                                                                                      | `boolean`                                                                                   | `false`                                | `0.4.4`  |
| disabledPluginTooltip(deprecated at `1.0.0`) | 禁用内置的批注插件                                                                                                      | `boolean`                                                                                   | `false`                                | `0.4.4`  |
| onZoomChange                                 | 缩放事件                                                                                                                | `(zoom: number) => void`                                                                    | `-`                                    | `0.4.5`  |
| dropFile                                     | 是否支持拖拽打开文件                                                                                                    | `boolean`                                                                                   | `false`                                | `1.9.0`  |
| onPageChange                                 | 翻页事件                                                                                                                | `(page: number) => void`                                                                    | `-`                                    | `1.11.2` |
| pdfJsParams                                  | 额外的 pdfjs 参数，具体参数可(查看这里)[https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html]                | `object`                                                                                    | `-`                                    | `1.11.0` |
| outputScale                                  | 渲染頁面的缩放级别                                                                                                      | `number`                                                                                    | `Math.max(window.devicePixelRatio, 1)` | `1.17.0` |

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

| 方法名称                                | 描述                             | 类型                                                                                          | 版本                      |
| --------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------- |
| load                                    | 加载文件                         | `(file: ArrayBuffer, options?: {title?: string, resetScrollTop?: boolean }) => Promise<void>` | `0.2.0` 增加 `title` 属性 |
| close                                   | 关闭文件                         | `() => void`                                                                                  | `0.1.0`                   |
| setZoom                                 | 设置缩放级别                     | `(zoom: number) => void`                                                                      |                           |
| getZoom                                 | 取得当前缩放级别                 | `() => number`                                                                                |                           |
| changePage                              | 翻页（从 0 开始）                | `(pageIndex: number, anim?: boolean) => void`                                                 |                           |
| scrollTo                                | 控制页面滚动到特定未知           | 同 `HTMLElement.scrollTo`                                                                     |                           |
| getCurrentPage                          | 获取当前窗口中的页码，从 0 开始  | `() => number`                                                                                |                           |
| getPageCount                            | 获取当前页面数量                 | `() => number`                                                                                |                           |
| getPageBlob                             | 获取页面的渲染信息（图片二进制） | `(index: number, options?: { scale?: number },) => Promise<Blob>`                             |                           |
| getAllMarkData(deprecated at `1.0.0`)   | 获取当前页面中所有的标注数据     | `() => ShapeDataType[][]`                                                                     | `0.0.5`                   |
| setMarkData(deprecated at `1.0.0`)      | 更新某一页的标注数据             | `(page: number, markData: ShapeDataType[]) => void`                                           | `0.0.5`                   |
| setAllMarkData(deprecated at `1.0.0`)   | 更新所有页面的标注数据           | `(markData: ShapeDataType[][]) => void`                                                       | `0.0.5`                   |
| clearAllMarkData(deprecated at `1.0.0`) | 清除所有页面的标注数据           | `() => void`                                                                                  | `0.0.6`                   |
| setTitle                                | 设置文件标题                     | `(title: string) => void`                                                                     | `0.2.0`                   |
| getFileSource                           | 获取当前加载的文件资源           | `() => string / URL / ArrayBuffer / undefined`                                                | `1.7.0`                   |

## API - PDFTooltipPlugin

`1.0.0`

批注插件，用于在 PDF 的页面上添加文本批注

### 属性

| 属性名称       | 描述                 | 类型                                                                                                         | 默认值 | 版本    |
| -------------- | -------------------- | ------------------------------------------------------------------------------------------------------------ | ------ | ------- |
| defaultChecked | 默认选中的批注       | `[number, number]`                                                                                           | -      | `1.0.0` |
| checked        | 当前选中的批注       | `[number, number]`                                                                                           | -      | `1.0.0` |
| onCheck        | 选中批注时的回调函数 | `(checked: [number, number]) => void`                                                                        | -      | `1.0.0` |
| defaultData    | 默认数据             | `TooltipDataType[][]`                                                                                        | -      | `1.0.0` |
| data           | 数据                 | `TooltipDataType[][]`                                                                                        | -      | `1.0.0` |
| onDataChange   | 数据变化时的回调函数 | `(data: TooltipDataType[][], action: 'add' / 'change' / 'delete', pageIndex: number, index: number) => void` | -      | `1.0.0` |
| autoCheck      | 是否自动选中         | `boolean`                                                                                                    | `true` | `1.0.0` |
| initialAttr    | 初始属性             | `PDFTooltipPainterProps['initialAttr']`                                                                      | -      | `1.0.0` |
| onChangeStart  | 开始更改时的回调函数 | `(pageIndex: number, index: number) => void`                                                                 | -      | `1.0.0` |

### PDFTooltipPluginHandle

使用 `ref` 以获得 `PDFTooltipPluginHandle`。

| 属性名称    | 描述                 | 类型                                   | 默认值 | 版本 |
| ----------- | -------------------- | -------------------------------------- | ------ | ---- |
| drawTooltip | 在当前页面上绘制批注 | `(attr?: Record<string, any>) => void` | -      |      |
| cancelDraw  | 取消绘制批注         | `() => void`                           | -      |      |

## API - PDFPainterPlugin

绘图插件，用于在 PDF 的页面上绘图

### 属性

`1.0.0`

| 属性名称       | 描述                     | 类型                                                                                                       | 默认值  | 版本 |
| -------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------- | ------- | ---- |
| defaultData    | 默认的绘图数据           | `ShapeDataType[][]`                                                                                        | -       |      |
| data           | 绘图数据                 | `ShapeDataType[][]`                                                                                        | -       |      |
| onDataChange   | 绘图数据变化时的回调函数 | `(data: ShapeDataType[][], action: 'add' / 'change' / 'delete', pageIndex: number, index: number) => void` | -       |      |
| disabledButton | 是否禁用按钮             | `boolean`                                                                                                  | `false` |      |
| autoCheck      | 是否自动选中             | `boolean`                                                                                                  | `true`  |      |
| popupVisible   | 是否展示绘图下拉弹出窗     | `boolean`                                                                                                  | `true`  |      |
| drawingVisible | 是否展示绘图按钮          | `boolean`                                                                                                  | `true`  |      |
| drawingPluginId | 插件实例ID (解决插件组合使用，状态冲突问题)          | `string`                                                                                                  | `PDFPainterPlugin`  |      |
| onChangeStart  | 开始绘图时的回调函数     | `(pageIndex: number, index: number) => void`                                                               | -       |      |
| defaultChecked | 默认选中的区域           | `[number, number]`                                                                                         | -       |      |
| checked        | 选中的区域               | `[number, number]`                                                                                         | -       |      |
| onCheck        | 选中区域变化时的回调函数 | `(checked: [number, number]) => void`                                                                      | -       |      |

### PDFPainterPluginHandle

| 方法名称   | 描述     | 类型                                                        | 版本 |
| ---------- | -------- | ----------------------------------------------------------- | ---- |
| drawMark   | 开始绘图 | `(shapeType: ShapeType, attr: Record<string, any>) => void` |      |
| cancelDraw | 取消绘图 | `() => void`                                                |      |
