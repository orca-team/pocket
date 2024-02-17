import type { FormInstance, FormItemProps } from 'antd';
import type { InternalNamePath, NamePath } from 'antd/es/form/interface';
import type { ColumnGroupType } from 'antd/es/table';
import type { ColumnType } from 'antd/lib/table';
import type React from 'react';

export type EditableColumnExtraRenderParams = {

  /** Form 实例 */
  form: FormInstance<any>;

  /** 当前行在数据中的索引值 */
  rowNameIndex: number;

  /** 当前行的 name 路径*/
  rowNamePath: InternalNamePath;

  /** 表格的 name 路径，用于嵌套多层 Form.List 时，在 render 时可以获取到表格当前行完整的 name 路径 */
  tableNamePath?: InternalNamePath;
};

/** 为 render 方法增加透传出去的第四个参数 extraParams */
export type EditableColumnRenderFunc<RecordType> = (
  value: any,
  record: RecordType,
  index: number,
  extraParams: EditableColumnExtraRenderParams,
) => React.ReactNode;

export type EditableTableActionType<RecordType = any> = {

  /** 新增一行编辑记录，支持在特定位置插入 */
  addEditRecord: (data?: RecordType, insertIndex?: number) => void;

  /** 移除某一行编辑记录 */
  removeEditRecord: (rowIndex: number) => void;
};

/** 基于 antd 的 Table Column 参数进行改造和扩展 */
export interface EditableExtraColumn<RecordType> {

  /** dataIndex 改造为 NamePath */
  dataIndex?: NamePath;

  /** 当前列是否可编辑，默认可编辑 */
  isEditable?: boolean;

  /** 自定义 readonly 模式下的组件渲染 */
  render?: EditableColumnRenderFunc<RecordType>;

  /** 自定义编辑模式下的 formItem 组件渲染 */
  renderFormItem?: EditableColumnRenderFunc<RecordType>;

  /** Form.Item props */
  formItemProps?: Omit<FormItemProps, 'label' | 'noStyle'>;
}

export interface MergedColumnGroupType<RecordType> extends Omit<ColumnGroupType<RecordType>, 'render'>, EditableExtraColumn<RecordType> {}
export interface MergedColumnType<RecordType> extends Omit<ColumnType<RecordType>, 'render' | 'dataIndex'>, EditableExtraColumn<RecordType> {}
export type EditableColumnType<RecordType> = MergedColumnGroupType<RecordType> | MergedColumnType<RecordType>;
export type EditableColumnsType<RecordType> = EditableColumnType<RecordType>[];
