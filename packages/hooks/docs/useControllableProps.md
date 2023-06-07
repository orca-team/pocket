---
title: useControllableProps 管理受控属性

group:
  title: hooks
  path: /base
---

# useControllableProps 管理受控属性

## 使用方式：

```ts | pure
import { useControlledProps } from "@orca-fe/hooks";

const FuncComp = (props) => {
  const [controlledProps, changeProps] = useControlledProps(props, initialState, config);
  return (...);
}
```

- `props` 来自函数组件的 props
- `initialState` 同`ControlledProps`的`initialState`，都是用于标记受控属性的初始值
- `config` 同`ControlledProps`的`config`
- `controlledProps` 根据计算，得出的你想要的属性内容（除了标记的受控属性，还包含`props`中的其它属性，所以后面可以完全替代`props`使用）
- `changeProps` 同`ControlledProps`的`changeProps`，修改受控属性的方法

## API

### Props

| 属性                   | 说明                            | 类型      | 默认值 |
| ---------------------- | ------------------------------- | --------- | ------ |
| initialState           | 初始化的属性                    | `Object`  | `{}`   |
| config.useOmitProps    | 是否组件注入一个 omitProps 属性 | `boolean` | `true` |
| config.autoOnChange    | 是否为每个属性对应分配一个事件  | `boolean` | `true` |
| config.combineListener | 是否为所有属性分配一个事件      | `boolean` | `true` |
