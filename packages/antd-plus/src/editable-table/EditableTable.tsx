import { useControllableValue, useMemoizedFn } from 'ahooks';
import type { FormItemProps, TablePaginationConfig, TableProps } from 'antd';
import { Form, Input, Table } from 'antd';
import type { AnyObject } from 'antd/es/table/Table';
import type { NamePath } from 'antd/lib/form/interface';
import type { ColumnGroupType, ColumnType } from 'antd/lib/table';
import { cloneDeep, isFunction, isNull, isUndefined } from 'lodash-es';
import React, { useImperativeHandle, useMemo, useState } from 'react';
import type { EditableColumnExtraRenderParams, EditableColumnRenderFunc } from './types';

export type EditableTableActionType<RecordType = any> = {

  /** 新增一行编辑记录，支持在特定位置插入 */
  addEditRecord: (data?: RecordType, insertIndex?: number) => void;

  /** 移除某一行编辑记录 */
  removeEditRecord: (rowIndex: number) => void;
};

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

export interface EditableTableProps<RecordType extends AnyObject> extends Omit<TableProps<RecordType>, 'columns' | 'dataSource' | 'onChange'> {

  /** 表单字段名称 */
  name: NamePath;

  /** 列配置 */
  columns?: EditableColumnsType<RecordType>;

  /** 是否只读 */
  readonly?: boolean;

  /** 外部控制 EditableTable 数据的 ref */
  actionRef?: React.MutableRefObject<EditableTableActionType<RecordType> | undefined>;

  /** 受控的 rowKeys */
  editableRowKeys?: (string | number)[];

  /** onTableChange 代替 antd Table 的 onChange 进行使用 */
  onTableChange?: TableProps<RecordType>['onChange'];

  /** 等同于 dataSource */
  value?: RecordType[];

  /** onChange 返回当前 List 值 */
  onChange?: (value?: RecordType[]) => void;

  /** 默认渲染的 Form.Item 组件，内部默认使用 Input */
  defaultFormItem?: React.ReactNode;
}

/**
 * 判断给定的name参数是否为NamePath类型，如果不是undefined或null则返回true，否则返回false。
 * @param name - 可选参数，NamePath类型的变量或null
 * @returns boolean
 */
const isValidNamePath = (name?: NamePath | null): name is NamePath => !(isUndefined(name) || isNull(name));

const getNamePath = (name: NamePath) => (Array.isArray(name) ? name : [name]);

const InternalEditableTable = <RecordType extends AnyObject = AnyObject>(props: EditableTableProps<RecordType>) => {
  const {
    name,
    columns,
    actionRef,
    defaultFormItem = <Input placeholder="请输入" />,
    readonly,
    rowKey: _rowKey,
    editableRowKeys,
    pagination = false,
    onChange,
    onTableChange,
    ...otherProps
  } = props;

  const [value, setValue] = useControllableValue<RecordType[] | undefined>(props);
  const form = Form.useFormInstance();
  const [_this] = useState<{ currentPagination: TablePaginationConfig }>({
    currentPagination: !pagination ? { current: 1, pageSize: 10 } : pagination,
  });

  useImperativeHandle(actionRef, () => ({
    addEditRecord: (record, insertIndex) => {
      if (!readonly) {
        const newValue = cloneDeep(value ?? []);
        newValue.splice(insertIndex ?? newValue.length, 0, record ?? Object.assign({}));
        setValue(newValue);
      }
    },
    removeEditRecord: (rowIndex) => {
      if (!readonly) {
        setValue(value?.filter((_, i) => i !== rowIndex));
      }
    },
  }));

  // 读取当前 rowKey
  const getRowKey = useMemoizedFn((record: RecordType, index?: number) => {
    if (isFunction(_rowKey)) {
      return _rowKey(record, index);
    }

    return (record as any)?.[_rowKey ?? 'key'];
  });

  const getNameIndex = useMemoizedFn((index: number) => {
    if (!pagination) return index;
    const { current = 1, pageSize = 10 } = _this.currentPagination;
    const page = current - 1;
    return page * pageSize + index;
  });

  // 合并 column
  const mergeColumn = useMemoizedFn((column: EditableColumnType<RecordType>) => {
    const { render: _render = v => v, dataIndex, isEditable = true, renderFormItem, formItemProps = {}} = column;

    return {
      ...column,
      render: (value, record, index) => {
        const currentRowKey = getRowKey(record, index);
        const isValidDataIndex = isValidNamePath(dataIndex);
        const currentNameIndex = getNameIndex(index);
        const currentName = isValidDataIndex ? [...getNamePath(name), currentNameIndex, ...getNamePath(dataIndex)] : undefined;
        const extraParams: EditableColumnExtraRenderParams = { form, currentNameIndex, currentName };

        if (!readonly && isEditable && (isUndefined(editableRowKeys) || editableRowKeys.includes(currentRowKey))) {
          const formItemComponent = isFunction(renderFormItem) ? renderFormItem(value, record, index, extraParams) : defaultFormItem;

          return isValidDataIndex ? (
            <Form.Item name={currentName} noStyle {...formItemProps}>
              {formItemComponent}
            </Form.Item>
          ) : (
            formItemComponent
          );
        }

        return _render(value, record, index, extraParams);
      },
    };
  });

  const mergedColumns = useMemo(() => columns?.map(mergeColumn) as TableProps<RecordType>['columns'], [columns, readonly]);

  return (
    <Table
      dataSource={value}
      columns={mergedColumns}
      rowKey={_rowKey}
      pagination={pagination}
      onChange={(currentPagination, filters, sorter, extra) => {
        _this.currentPagination = currentPagination;
        onTableChange?.(currentPagination, filters, sorter, extra);
      }}
      {...otherProps}
    />
  );
};

const EditableTable = <RecordType extends AnyObject = AnyObject>(props: EditableTableProps<RecordType>) => {
  const { name } = props;

  return (
    <Form.Item name={name}>
      <InternalEditableTable {...props} />
    </Form.Item>
  );
};

if (process.env.NODE_ENV !== 'production') {
  EditableTable.displayName = 'EditableTable';
}

export default EditableTable;
