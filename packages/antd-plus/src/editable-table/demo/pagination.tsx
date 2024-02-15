import type { SelectProps } from 'antd';
import { Button, Form, InputNumber, Select, Space, Switch, Tag } from 'antd';
import type { EditableColumnsType, EditableTableActionType } from '@orca-fe/antd-plus';
import { EditableTable } from '@orca-fe/antd-plus';
import { useRef, useState } from 'react';

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

const dataSource = new Array(30).fill(0)
  .map((_, index) => data[index % 3]);

export default () => {
  const [form] = Form.useForm();
  const [valuesString, setValuesString] = useState('');
  const [readonly, setReadonly] = useState(false);
  const actionRef = useRef<EditableTableActionType>();

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
      renderFormItem: () => <Select mode="multiple" options={tagOptions} placeholder="请选择" />,
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 6 }}>
        <Switch
          checked={readonly}
          onChange={(checked) => {
            setReadonly(checked);
          }}
        />
        <span>只读模式</span>
      </Space>
      <Form form={form} initialValues={{ list: dataSource }}>
        <EditableTable name="list" readonly={readonly} actionRef={actionRef} columns={columns} pagination={{ showSizeChanger: true }} />
      </Form>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            const values = form.getFieldsValue();
            setValuesString(JSON.stringify(values, null, 2));
          }}
        >
          读取数据
        </Button>
      </Space>
      <pre>{valuesString}</pre>
    </div>
  );
};
