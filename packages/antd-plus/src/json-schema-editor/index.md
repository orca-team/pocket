---
title: JsonSchemaEditor JSON结构编辑器

group:
  title: 基础组件
  path: /base
---

# JsonSchemaEditor JSON 结构编辑器

<code src="./demo/demo1.tsx" ></code>

## API

| 属性     | 说明           | 类型                             | 默认值 |
| -------- | -------------- | -------------------------------- | ------ |
| value    | JSON 结构描述  | `JsonValueType`                  | `-`    |
| onChange | value 变化事件 | `(value: JsonValueType) => void` | `-`    |

### JsonValueType

```ts | pure
export interface BaseType {
  name: string;
  required?: boolean;
  nullable?: boolean;
  type: string;
  description?: string;
}

export interface StringValueType extends BaseType {
  type: 'string';
}

export interface NumberValueType extends BaseType {
  type: 'number';
}

export interface BooleanValueType extends BaseType {
  type: 'boolean';
}

export interface NullValueType extends BaseType {
  type: 'null';
}

export interface ObjectValueType extends BaseType {
  type: 'object';
  items: JsonValueType[];
}

export interface ArrayValueType extends BaseType {
  type: 'array';
  items: JsonValueType[];
}

export type JsonValueType = StringValueType | NumberValueType | BooleanValueType | NullValueType | ObjectValueType | ArrayValueType;
```
