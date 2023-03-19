export type TypeDef = 'color' | 'font' | 'number';

interface BaseType {

  /** 属性 key */
  key: string;

  /** 属性名称 */
  name?: string;

  /** 属性类型 */
  type: TypeDef;

  defaultValue?: any;
}

export interface ColorType extends BaseType {
  type: 'color';
  defaultValue?: string;
}

export interface FontType extends BaseType {
  type: 'font';
  defaultValue?: string;
}

export interface NumberType extends BaseType {
  type: 'number';
  max?: number;
  min?: number;
  step?: number;
  defaultValue?: number;
}

export type PropsType = ColorType | FontType | NumberType;
