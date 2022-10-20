export interface BaseType {
  name: string;
  required?: boolean;
  nullable?: boolean;
  type: string;
  description?: string;
  defaultValue?: string;
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

export type JsonValueType =
  | StringValueType
  | NumberValueType
  | BooleanValueType
  | NullValueType
  | ObjectValueType
  | ArrayValueType;
