---
title: ValueMapping 組件值映射

group:
  title: 表單增強
  path: /form
  order: 1
---

# ValueMapping 組件值映射

我们在进行表单功能开发时，通常接口数据和表单组件所需要的数据是不一致的。最典型的就是 日期选择组件，接口返回的是 `String`，而组件需要的是 `moment` / `dayjs` 对象。

我们常规的做法是，在接口请求完成后，将数据转换为 `moment` 对象，并存入表单。在提交时，将 `moment` 对象转换为 `String`，再调用接口。

如果这样的接口非常多，字段也非常多，就要编写大量的转换代码，这样的代码是非常冗余的。

所以，如果将数据转换的操作下放到末端的表单组件上，让表单组件去适配接口数据，就可以大大减少转换代码的编写。

`ValueMapping` 组件，是一个用于对组件 `value` 值进行映射的组件，它可以实现上面所说的，将 `DatePicker` 的 `value` 属性改为 `String` 类型。

## 使用简介

你需要使用 `createValueMappedComponent` 方法，将你需要转换的组件进行包装，并配置好映射关系。
请查看下面的示例。

## 示例

<code src="./demo/Demo1.tsx"></code>
<code src="./demo/Demo2.tsx"></code>

## API

### createValueMappingComponent

将多个字段映射到一个组件的多个属性上

| 属性           | 说明                           | 类型                               | 默认值       | 版本 |
| -------------- | ------------------------------ | ---------------------------------- | ------------ | ---- |
| valuePropName  | 属性名                         | `string`                           | `'value'`    | -    |
| trigger        | 触发器名                       | `string`                           | `'onChange'` | -    |
| mapping        | 一对一值映射，用于简单的值映射 | `[BasicType, BasicType][]`         | -            | -    |
| mappingValue   | 值映射函数                     | `(value: any, props?: any) => any` | -            | -    |
| mappingTrigger | 事件映射函数                   | `(value: any, props?: any) => any` | -            | -    |
