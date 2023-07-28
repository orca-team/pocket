/**
 * title: 使用函数进行值映射
 * description: 创建一个 DatePicker 组件，接收 string 类型的值，但是内部使用 dayjs 进行处理
 */
import React, { useState } from 'react';
import { DatePicker, Form } from 'antd';
import { createValueMappedComponent } from '@orca-fe/antd-plus';
import dayjs from 'dayjs';

// 通过 createValueMappedComponent 创建一个 DatePickerString 组件，接收 string 类型的值，但是内部使用 dayjs 进行处理（如果你使用的是 antd@4，可以将 dayjs 替换为 moment）
const DatePickerString = createValueMappedComponent(DatePicker, {
  mappingValue: (value) => {
    if (typeof value === 'string') {
      const m = dayjs(value);
      if (m.isValid()) {
        return m;
      }
    }
    return undefined;
  },
  mappingTrigger: (value, props) => {
    const { format = 'YYYY-MM-DD' } = props;
    // 如果變化的 value 是 moment 格式，則轉換成 string 格式
    if (value && dayjs.isDayjs(value)) {
      return value.format(format);
    }
    return value;
  },
});

const Demo2 = () => {
  const [formValue, setFormValue] = useState({});

  return (
    <div>
      <Form
        onValuesChange={(_, values) => {
          setFormValue(values);
        }}
      >
        <Form.Item name="date">
          <DatePickerString />
        </Form.Item>
      </Form>
      <pre>{JSON.stringify(formValue, null, 2)}</pre>
    </div>
  );
};

export default Demo2;
