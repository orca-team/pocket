---
title: CustomBreadcrumb 自定义面包屑

group:
  title: 基础组件
  path: /base
---

# CustomBreadcrumb 自定义面包屑

自定义面包屑。自定义面包屑具备面包屑的基础功能，会根据菜单的定义及当前路由，自动整理出对应的面包屑信息，并实现面包屑渲染。
同时支持在页面任意位置自定义额外的面包屑信息，适用于渲染临时页面的面包屑状态（如提交结果，详情页等）

**注意： `CustomBreadcrumb` 本身仅有自定义面包屑声明的功能，如需渲染面包屑，必须在页面顶部使用 `CustomBreadcrumb.Renderer` 组件。详见下方示例**

## 示例

### 基础用法（建议结合 MenuLayout 使用）

<code src="./demo/Demo1.tsx"></code>

### 自定义面包屑（详情页）

<code src="./demo/Demo2.tsx"></code>

## API

### CustomBreadcrumb

| 属性  | 说明                                                                                                         | 类型              | 默认值 |
| ----- | ------------------------------------------------------------------------------------------------------------ | ----------------- | ------ |
| path  | 自定义面包屑的路径                                                                                           | `string`          | -      |
| text  | 自定义面包屑的显示内容                                                                                       | `React.ReactNode` | -      |
| order | 自定义面包屑的排序，该字段会参与到面包屑数组下标的排序中，你甚至可以通过该属性，将自定义面包屑插入到指定位置 | `number`          | -      |

### CustomBreadcrumb.Renderer

| 属性        | 说明                        | 类型                                                         | 默认值 |
| ----------- | --------------------------- | ------------------------------------------------------------ | ------ |
| prefix      | 自定义面包屑前缀，如 `首页` | `{ path?: string; text?: React.ReactNode; order?: number; }` | -      |
| separator   | 面包屑分隔符                | `React.ReactNode`                                            | '/'    |
| onLinkClick | 面包屑 Link 点击事件        | `(link: BaseMenuType, e: React.MouseEvent) => void`          | -      |
