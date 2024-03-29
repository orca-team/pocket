---
title: MenuLayout 菜单布局

group:
  title: Layout
  path: /layout
---

# MenuLayout 菜单布局

常用的基础菜单功能

## 示例

### 基础用法

<code src="./demo/Demo1.tsx"></code>

### 通过属性控制菜单样式

<code src="./demo/Demo2.tsx"></code>

## API

| 属性              | 说明                                                                                                                        | 类型                                                                  | 默认值          |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------- |
| pathname          | 传入自定义的路径，用于自定义当前菜单应该被选中的项，如果不传，会自动读取 `history` 的 `pathname`                            | `string`                                                              | -               |
| mainMenuSide      | 主菜单所在位置，以 顶部/侧边 为主                                                                                           | `'top'` / `'left' `                                                   | `'left'`        |
| useTopMenu        | 是否在顶部渲染一级菜单，当 `mainMenuSide` = `left` 时，该配置项不生效，因为在主菜单设为左侧时，顶栏是没有足够空间渲染菜单的 | `boolean`                                                             | `true`          |
| menu              | 菜单数据                                                                                                                    | `MenuItemType[] `                                                     | -               |
| showHeader        | 是否显示 header                                                                                                             | `boolean`                                                             | `true`          |
| headerExtra       | 顶栏的额外内容（最右侧，支持自定义 React 内容）                                                                             | `React.ReactNode`                                                     | -               |
| logo              | 自定义 logo                                                                                                                 | `React.ReactNode`                                                     | -               |
| title             | 自定义 标题                                                                                                                 | `React.ReactNode`                                                     | `'Menu Layout'` |
| collapsible       | 是否支持侧边菜单收起                                                                                                        | `boolean`                                                             | `true`          |
| collapse          | 控制侧边菜单收起                                                                                                            | `boolean`                                                             | -               |
| onCollapseChange  | 侧边菜单收起事件                                                                                                            | `(collapse: boolean) => void`                                         | -               |
| themeHeader       | 顶栏的主题色                                                                                                                | `'dark'` / `'light'`                                                  | `'dark'`        |
| themeSide         | 侧边栏的主题色                                                                                                              | `'dark'`/ `'light'`                                                   | `'dark'`        |
| onItemClick       | 菜单点击事件                                                                                                                | `((event: React.MouseEvent, menuInfo: MenuItemType) => void) => void` | `false`         |
| toggleOnItemClick | 点击 item 的时候，强制展开/收起。默认情况下，只有点击不包含`path`的 item，才会展开子菜单，否则需要点击下垃建投              | `boolean`                                                             | -               |
| classPrefix       | 菜单组件的 class 前缀，可用于在微前端环境下实现样式隔离                                                                     | `string`                                                              | `'orca-menu'`   |
| wrapperClassName  | 容器的 className                                                                                                            | `string`                                                              | -               |
| wrapperStyle      | 容器的 style                                                                                                                | `CSS`                                                                 | -               |

## MenuItemType 菜单项格式

| 属性     | 说明           | 类型                                                 |
| -------- | -------------- | ---------------------------------------------------- |
| key      | 菜单项唯一标识 | `string`                                             |
| icon     | 菜单项的图表   | `React.ReactNode`                                    |
| path     | 菜单项的路由   | `string`                                             |
| text     | 菜单文本       | `string`                                             |
| visible  | 菜单是否隐藏   | `boolean`                                            |
| render   | 自定义菜单渲染 | `(options: { checked: boolean }) => React.ReactNode` |
| children | 子菜单         | `MenuItemType[]`                                     |
| style    | 自定义样式     | `CSS`                                                |
