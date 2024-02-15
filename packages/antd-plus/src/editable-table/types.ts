import type { FormInstance } from 'antd';
import type { NamePath } from 'antd/es/form/interface';
import type React from 'react';

export type EditableColumnExtraRenderParams = {
  form: FormInstance<any>;

  /** 当前行在数据中的索引值 */
  currentNameIndex: number;

  /** 当前行的 name */
  currentName?: NamePath;
};

/** 为 render 方法增加透传出去的第四个参数 extraParams */
export type EditableColumnRenderFunc<RecordType> = (
  value: any,
  record: RecordType,
  index: number,
  extraParams: EditableColumnExtraRenderParams,
) => React.ReactNode;
