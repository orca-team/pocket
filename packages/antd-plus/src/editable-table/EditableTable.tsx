import { useControllableValue, useMemoizedFn } from 'ahooks';
import type { TablePaginationConfig, TableProps, FormItemProps } from 'antd';
import { Form, Input, Table } from 'antd';
import type { AnyObject } from 'antd/es/table/Table';
import type { NamePath } from 'antd/lib/form/interface';
import { cloneDeep, isFunction, isNull, isUndefined } from 'lodash-es';
import React, { useImperativeHandle, useMemo, useState } from 'react';
import type { InternalNamePath } from 'antd/es/form/interface';
import type { EditableColumnExtraRenderParams, EditableColumnType, EditableColumnsType, EditableTableActionType } from './types';

export interface EditableTableProps<RecordType extends AnyObject> extends Omit<TableProps<RecordType>, 'columns' | 'dataSource' | 'onChange'> {

  /** 表单字段名称 */
  name: NamePath;

  /** 表格的 name 路径，用于嵌套多层 Form.List 时，在 render 时可以获取到表格当前行完整的 name 路径 */
  tableNamePath?: InternalNamePath;

  /** 是否只读 */
  readonly?: boolean;

  /** 列配置 */
  columns?: EditableColumnsType<RecordType>;

  /** 外部控制 EditableTable 编辑行的 ref */
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
    tableNamePath = [],
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
      render: (currentValue, record, index) => {
        const currentRowKey = getRowKey(record, index);
        const isValidDataIndex = isValidNamePath(dataIndex);
        const rowNameIndex = getNameIndex(index);
        const rowNamePath = isValidDataIndex ? [...getNamePath(name), rowNameIndex, ...getNamePath(dataIndex)] : [];
        const extraParams: EditableColumnExtraRenderParams = { form, rowNameIndex, rowNamePath, tableNamePath };

        if (!readonly && isEditable && (isUndefined(editableRowKeys) || editableRowKeys.includes(currentRowKey))) {
          const formItemComponent = isFunction(renderFormItem) ? renderFormItem(currentValue, record, index, extraParams) : defaultFormItem;

          return isValidDataIndex ? (
            <Form.Item name={rowNamePath} noStyle {...formItemProps}>
              {formItemComponent}
            </Form.Item>
          ) : (
            formItemComponent
          );
        }

        return _render(currentValue, record, index, extraParams);
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

const EditableTable = <RecordType extends AnyObject = AnyObject>(
  props: EditableTableProps<RecordType> & {
    formItemProps?: Omit<FormItemProps, 'name'>;
  },
) => {
  const { name, formItemProps = {}, ...otherProps } = props;

  return (
    <Form.Item name={name} noStyle {...formItemProps}>
      <InternalEditableTable name={name} {...otherProps} />
    </Form.Item>
  );
};

if (process.env.NODE_ENV !== 'production') {
  EditableTable.displayName = 'EditableTable';
}

export default EditableTable;
