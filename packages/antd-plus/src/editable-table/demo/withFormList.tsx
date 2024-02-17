import type { SelectProps } from 'antd';
import { Button, Card, Divider, Form, InputNumber, Select, Space, Tag } from 'antd';
import type { EditableColumnsType } from '@orca-fe/antd-plus';
import { EditableTable } from '@orca-fe/antd-plus';
import { useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import type { InternalNamePath } from 'antd/es/form/interface';
import { OpenBox } from '@orca-fe/pocket';

interface DataType {
  name: string;
  age: number;
  address: string;
  tags?: string[];
}

const tagOptions: SelectProps['options'] = [
  {
    label: '标签A',
    value: 'a',
  },
  {
    label: '标签B',
    value: 'b',
  },
  {
    label: '标签C',
    value: 'c',
  },
  {
    label: '标签D',
    value: 'd',
  },
  {
    label: '标签E',
    value: 'e',
  },
];

const data: DataType[] = [
  {
    name: '张三',
    age: 19,
    address: '地址1地址1地址1',
    tags: ['b', 'c'],
  },
];

const initialValues = { rootList: [{ rootTable: data }] };

export default () => {
  const [form] = Form.useForm();
  const [valuesString, setValuesString] = useState(JSON.stringify(initialValues, null, 2));
  const [valuesStringVisible, setValuesStringVisible] = useState(false);

  const columns: EditableColumnsType<DataType> = [
    {
      title: '姓名',
      dataIndex: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      renderFormItem: () => <InputNumber min={0} placeholder="请输入" />,
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (_, { tags }) => <>{tags?.map(tag => <Tag key={tag}>{tagOptions.find(t => t.value === tag)?.label ?? '-'}</Tag>)}</>,
      renderFormItem: () => <Select mode="multiple" options={tagOptions} placeholder="请选择" style={{ width: 200 }} />,
    },
  ];

  const addRowData = (tableNamePath: InternalNamePath) => {
    const currentTable = form.getFieldValue(tableNamePath) ?? [];
    form.setFieldValue(tableNamePath, currentTable.concat([{}]));
  };

  const deleteRowData = (tableNamePath: InternalNamePath, rowNameIndex: number) => {
    const tableData = form.getFieldValue(tableNamePath) ?? [];
    form.setFieldValue(
      tableNamePath,
      tableData.filter((_, idx) => idx !== rowNameIndex),
    );
  };

  const rootColumns: EditableColumnsType<DataType> = [
    ...columns,
    {
      title: '操作',
      isEditable: false,
      render: (_, record, index, extraParams) => (
        <Space size="middle">
          <a
            onClick={() => {
              deleteRowData(extraParams.tableNamePath ?? [], extraParams.rowNameIndex);
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  const subColumns: EditableColumnsType<DataType> = rootColumns.map(col => ({ ...col, title: `子级${col.title}` }));

  return (
    <div>
      <Form
        form={form}
        initialValues={initialValues}
        onValuesChange={(_, values) => {
          setValuesString(JSON.stringify(values, null, 2));
        }}
      >
        <Form.List name="rootList">
          {(fields, { add, remove }) => (
            <div>
              {fields.map((field) => {
                const rootTableName = ['rootList', field.name, 'rootTable'];

                return (
                  <Card
                    key={field.key}
                    title={`父级表格${field.name + 1}`}
                    style={{ margin: '12px 0' }}
                    hoverable
                    extra={(
                      <Space>
                        <Button
                          onClick={() => {
                            addRowData(rootTableName);
                          }}
                        >
                          新增一行父级数据
                        </Button>
                        <Button
                          danger
                          type="primary"
                          icon={<MinusOutlined />}
                          disabled={fields.length <= 1}
                          onClick={() => {
                            remove(field.name);
                          }}
                        >
                          删除
                        </Button>
                      </Space>
                    )}
                  >
                    <EditableTable
                      key={field.key}
                      name={[field.name, 'rootTable']}
                      tableNamePath={rootTableName}
                      columns={rootColumns}
                      style={{ margin: '12px 0' }}
                    />
                    <Form.List name={[field.name, 'subList']}>
                      {(subFields, subOpt) => (
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                          {subFields.map((subField) => {
                            const subTableName = ['rootList', field.name, 'subList', subField.name, 'subTable'];

                            return (
                              <Card
                                type="inner"
                                key={subField.name}
                                title={`子级表格${subField.name + 1}`}
                                size="small"
                                hoverable
                                extra={(
                                  <Space>
                                    <Button
                                      size="small"
                                      onClick={() => {
                                        addRowData(subTableName);
                                      }}
                                    >
                                      新增一行子级数据
                                    </Button>
                                    <Button
                                      danger
                                      type="dashed"
                                      size="small"
                                      icon={<MinusOutlined />}
                                      disabled={subFields.length <= 1}
                                      onClick={() => {
                                        subOpt.remove(subField.name);
                                      }}
                                    >
                                      删除
                                    </Button>
                                  </Space>
                                )}
                              >
                                <EditableTable
                                  key={field.key}
                                  name={[subField.name, 'subTable']}
                                  tableNamePath={subTableName}
                                  columns={subColumns}
                                  size="small"
                                  bordered
                                  style={{ margin: '12px 0' }}
                                />
                              </Card>
                            );
                          })}
                          <Button
                            type="dashed"
                            block
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => {
                              subOpt.add({ subTable: [{}] });
                            }}
                          >
                            添加子级表格
                          </Button>
                        </Space>
                      )}
                    </Form.List>
                  </Card>
                );
              })}
              <Button
                type="primary"
                block
                icon={<PlusOutlined />}
                onClick={() => {
                  add({ rootTable: [{}] });
                }}
              >
                添加父级表格
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
      <Divider />
      <Space style={{ marginTop: 12 }}>
        <Button
          type="primary"
          onClick={() => {
            setValuesStringVisible(!valuesStringVisible);
          }}
        >
          {valuesStringVisible ? '收起' : '查看表单数据'}
        </Button>
      </Space>
      <OpenBox open={valuesStringVisible}>
        <pre>{valuesString}</pre>
      </OpenBox>
    </div>
  );
};
