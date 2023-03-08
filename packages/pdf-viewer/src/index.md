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

| 属性名称        | 描述                     | 类型                                                                          | 默认值 |
| --------------- | ------------------------ | ----------------------------------------------------------------------------- | ------ |
| pageGap         | 页面间距                 | `number`                                                                      | `24`   |
| maxZoom         | 最大缩放级别             | `number`                                                                      | `3`    |
| minZoom         | 最小缩放级别             | `number`                                                                      | `-4`   |
| renderPageCover | 渲染自定义的页面覆盖内容 | `(pageIndex: number, options: { viewport: PageViewport }) => React.ReactNode` | `-`    |
| onPageScroll    | 页面渲染事件             | `typeof onScroll`                                                             | `-`    |
