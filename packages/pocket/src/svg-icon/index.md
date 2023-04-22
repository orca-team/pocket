---
title: SvgIcon 图标组件
nav:
  title: Pocket 组件
  path: /component
group:
  title: 基础组件
  path: /base
---

# SvgIcon 图标组件

`2.1.0`

基于 Svg 实现的图标组件，支持渲染来自 [iconfont](https://www.iconfont.cn/) 的自定义图标。

由于 iconfont 的图标，仅支持以字体引入或 `svg use` 的方式，无法实现 `treeshaking`。

因此，我们提供了 `SvgIcon` 组件，支持使用 `iconfont-to-esm` 生成支持 `treeshaking` 的图标信息，并以 svg 的方式渲染。

## 示例

<code src="./demo/DemoBasic.tsx" ></code>

## API

| 属性            | 说明                       | 类型                                  | 默认值 |
| --------------- | -------------------------- | ------------------------------------- | ------ |
| size            | 大小                       | number \| string                      | -      |
| color           | 整体颜色                   | string                                | -      |
| icon            | 图标配置                   | IconDataType                          | -      |
| customPathProps | 覆盖自定义图标的 path 属性 | React.SVGAttributes<SVGPathElement>[] | -      |
| spinning        | 是否旋转                   | boolean                               | false  |
