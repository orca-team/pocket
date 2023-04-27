---
title: WeeklyCalendar 日历周视图
nav:
  title: Pocket 组件
  path: /component
group:
  title: 基础组件
  path: /base
---

# WeeklyCalendar 日历周视图

`2.2.0`

## 功能简介

周视图日程组件，以周视图的方式展示本周的所有日程，对日程数据抽象，你需要使用本组件再完善具体的日程配置。

## 示例

<code src="./demo/Demo1.tsx" ></code>

<code src="./demo/Demo2.tsx" ></code>

<code src="./demo/Demo3.tsx" ></code>

<code src="./demo/Demo4.tsx" ></code>

<code src="./demo/Demo5.tsx" ></code>

<code src="./demo/Demo6.tsx" ></code>

## API

```ts | pure
export type WeeklyCalendarDataType = {
  start: moment.MomentInput;
  end: moment.MomentInput;
  color?: string;
};
```

`泛型 T extends WeeklyCalendarDataType，即至少需要包含起止日期 start & end`

| 属性名称          | 描述                                                   | 类型                                                                                           | 默认值    | 版本    |
| ----------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | --------- | ------- |
| current           | 需要显示的日期                                         | `moment.Moment`                                                                                | 当前日期  |         |
| data              | 日程数据                                               | `T[]`                                                                                          | `[]`      |         |
| precision         | 时间精度（分钟）                                       | `number`                                                                                       | `15`      |         |
| checked           | 选中的数据下标                                         | `number`                                                                                       | `-1`      |         |
| mode              | 展示模式：周视图/日视图                                | `'week'` / `'day'`                                                                             | `'week'`  |         |
| showNow           | 是否展示当前时间，你也可以传入 moment 对象指定当前时间 | `boolean` / `moment.Moment`                                                                    | `true`    |         |
| showNowColor      | 当前时间的颜色                                         | `string`                                                                                       | `#ff0000` |         |
| placeholder       | 占位日程                                               | `WeeklyCalendarDataType`                                                                       | `-`       |         |
| renderPlaceholder | 渲染占位日程                                           | `(item: { start: moment.Moment end: moment.Moment }) => React.ReactNode`                       | `-`       |         |
| children          | 渲染任务数据                                           | `( item: T & { start: moment.Moment end: moment.Moment }, index: number, ) => React.ReactNode` | `-`       |         |
| onDataClick       | 任务数据点击事件                                       | `(item: T, index: number) => void`                                                             | `-`       |         |
| onEmptyClick      | 空白区域点击事件                                       | `(time: moment.Moment) => void`                                                                | `-`       |         |
| timelineHeader    | 左上角时间段的文本                                     | `string`                                                                                       | `时间段`  | `0.0.3` |
| renderHeader      | 自定义 Header 渲染                                     | `(element: React.ReactElement, date: Moment, options: {isToday: boolean}) => React.ReactNode`  | `-`       | `0.1.0` |
