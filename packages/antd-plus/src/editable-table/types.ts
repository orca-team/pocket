import type { FormInstance } from 'antd';
import type { InternalNamePath } from 'antd/es/form/interface';
import type React from 'react';

export type EditableColumnExtraRenderParams = {

  /** Form 实例 */
  form: FormInstance<any>;

  /** 当前行在数据中的索引值 */
  rowNameIndex: number;

  /** 当前行的 name 路径*/
  rowNamePath: InternalNamePath;

  /** 表格的 name 路径，用于嵌套多层 Form.List 时，在 render 时可以获取到表格当前行完整的 name 路径 */
  tableNamePath: InternalNamePath;
};

/** 为 render 方法增加透传出去的第四个参数 extraParams */
export type EditableColumnRenderFunc<RecordType> = (
  value: any,
  record: RecordType,
  index: number,
  extraParams: EditableColumnExtraRenderParams,
) => React.ReactNode;
