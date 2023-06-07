---
title: Flop 翻牌器

group:
  title: 基础组件
  path: /base
---

# Flop 翻牌器

数字翻牌器

## 示例

### 基础用法

<code src="./demo/Demo1.tsx" ></code>

## API

| 属性              | 说明                                         | 类型                       | 默认值     |
| ----------------- | -------------------------------------------- | -------------------------- | ---------- |
| value             | 数值                                         | `number`                   | `0`        |
| duration          | 翻拍动画时长(秒)                             | `number`                   | `2`        |
| decimals          | 指定小数位数                                 | `number`                   | -          |
| decimalsMaxLength | 最长小数位数，指定了`decimals`后，该属性无效 | `number`                   | `4`        |
| prefix            | 前缀                                         | `ReactNode`                | -          |
| suffix            | 后缀                                         | `ReactNode`                | -          |
| suffixProps       | 当后缀类型为`string`时，可传入额外的属性     | `HTMLAttributes`           | -          |
| numStyle          | 数字的样式                                   | `CSSProperties`            | -          |
| separator         | 千分位分隔符                                 | `string`                   | `','`      |
| convertUnit       | 是否支持格式转换                             | `false` / `ConvertOptions` | 万/亿/万亿 |
