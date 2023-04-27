---
title: VirtualCalendar 虚拟日历
nav:
  title: Pocket 组件
  path: /component
group:
  title: 基础组件
  path: /base
---

# 虚拟日历 VirtualCalendar

`2.2.0`

## 功能简介

这是一个简易的日历组件，你可以基于它进行业务上的二次开发。

相比普通的日历，这个日历使用了虚拟滚动，可以获得无限上下滚动的体验。

## 示例

<code src="./demo/Demo1.tsx" ></code>

<code src="./demo/Demo2.tsx" ></code>

## API

### VirtualCalendar 虚拟日历

```ts | pure
type CustomDateRenderType = (date: Moment, params: { lunar: string }) => React.ReactElement | undefined;
```

| 属性名称             | 描述                                                                         | 类型                      | 默认值                  | 版本    |
| -------------------- | ---------------------------------------------------------------------------- | ------------------------- | ----------------------- | ------- |
| startDate            | 日历能展示的最早的日期                                                       | `Moment`                  | `2010-01-01`            |         |
| endDate              | 日历能展示的最晚的日期                                                       | `Moment`                  | `2030-01-01`            |         |
| rowHeight            | 行高，当选择 'auto' 时，将会自动根据容器高度划分为 6 行                      | `number` / `'auto'`       | `'auto'`                |         |
| defaultCurrentMonth  | 默认展示的月份，默认为本月                                                   | `MomentInput`             | `今天`                  |         |
| today                | 今天的日期                                                                   | `MomentInput` / `boolean` | `今天`                  |         |
| checked              | 选中的日期                                                                   | `MomentInput`             | `-`                     |         |
| onDateClick          | 日期点击事件                                                                 | `(date: Moment) => void`  | `-`                     |         |
| monthFormat          | 顶部日期展示的格式                                                           | `string`                  | `'YYYY-MM'`             |         |
| weekHeaderFormat     | 周格式                                                                       | `string`                  | `'ddd'`                 |         |
| children             | 自定义日期渲染                                                               | `CustomDateRenderType`    | `-`                     |         |
| checkable            | 是否展示选中效果                                                             | `boolean`                 | `true`                  | `0.1.0` |
| monthChangeDebounce  | 因为虚拟日历组件是无线滚动的，为了避免频繁触发月份变化事件，这里增加触发防抖 | `number`                  | `300`                   | `0.1.0` |
| onCurrentMonthChange | 月份变化事件                                                                 | `(month: string) => void` | `-`                     | `0.1.0` |
| arrowUp              | 上翻页箭头                                                                   | `React.ReactNode`         | `<CaretUpOutlined />`   | `0.2.0` |
| arrowDown            | 下翻页箭头                                                                   | `React.ReactNode`         | `<CaretDownOutlined />` | `0.2.0` |

### CardCalendar

CardCalendar 具备 VirtualCalendar 的所有属性，除了 `checkable`，请使用 `checkMode` 属性代替。

| 属性名称         | 描述                   | 类型                         | 默认值       | 版本 |
| ---------------- | ---------------------- | ---------------------------- | ------------ | ---- |
| checkMode        | 选择模式： 按周/日选择 | `'week'` / `'day'` / `false` | `'day'`      |      |
| rowHeight        | 同 virtualCalendar     | 同 virtualCalendar           | `36`         |      |
| weekHeaderFormat | 同 virtualCalendar     | 同 virtualCalendar           | `'ddd'`      |      |
| monthFormat      | 同 virtualCalendar     | 同 virtualCalendar           | `YYYY年MM月` |      |
