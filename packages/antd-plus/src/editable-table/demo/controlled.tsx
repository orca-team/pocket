import type { SelectProps } from 'antd';
import { Form, InputNumber, Select, Space, Tag } from 'antd';
import type { EditableColumnsType, EditableTableActionType } from '@orca-fe/antd-plus';
import { EditableTable } from '@orca-fe/antd-plus';
import { useRef, useState } from 'react';

interface DataType {
  name: string;
  age: number;
  address: string;
  key?: number;
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
  {
    name: '李四',
    age: 27,
    address: '地址2地址2地址2',
    tags: ['a'],
  },
  {
    name: '王五',
    age: 22,
    address: '地址3地址3地址3',
    tags: ['d', 'e'],
  },
];

const dataSource = new Array(10).fill(0)
  .map((_, index) => ({ ...data[index % 3], key: index }));

export default () => {
  const [form] = Form.useForm();
  const [editableRowKeys1, setEditableRowKeys1] = useState<number[]>([]);
  const [editableRowKeys2, setEditableRowKeys2] = useState<number[]>([]);
  const [readonly] = useState(false);
  const actionRef = useRef<EditableTableActionType>();

  const columns1: EditableColumnsType<DataType> = [
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
      renderFormItem: () => <Select mode="multiple" options={tagOptions} placeholder="请选择" />,
    },
  ];

  const columns2 = [
    ...columns1,
    {
      title: '操作',
      isEditable: false,
      render: (_, record, index, extraParams) => (
        <Space size="middle">
          <a
            onClick={() => {
              if (editableRowKeys2.includes(record.key)) {
                setEditableRowKeys2(editableRowKeys2.filter(key => key !== record.key));
              } else {
                setEditableRowKeys2([...editableRowKeys2, record.key]);
              }
            }}
          >
            {editableRowKeys2.includes(record.key) ? '保存' : '编辑'}
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form form={form} initialValues={{ list1: dataSource, list2: dataSource }}>
        <Space style={{ marginBottom: 12 }}>
          <Select
            placeholder="请选择可编辑的表格行"
            mode="multiple"
            options={new Array(10).fill(0)
              .map((_, index) => ({ label: `第${index + 1}行`, value: index }))}
            onChange={(value) => {
              setEditableRowKeys1(value);
            }}
            style={{ width: 300 }}
          />
        </Space>
        <EditableTable
          name="list1"
          size="small"
          rowKey="key"
          editableRowKeys={editableRowKeys1}
          readonly={readonly}
          actionRef={actionRef}
          columns={columns1}
        />

        <EditableTable
          name="list2"
          size="small"
          rowKey="key"
          editableRowKeys={editableRowKeys2}
          readonly={readonly}
          actionRef={actionRef}
          columns={columns2}
        />
      </Form>
    </div>
  );
};
