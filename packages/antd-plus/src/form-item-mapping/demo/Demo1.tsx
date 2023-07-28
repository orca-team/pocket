/**
 * title: 基本使用
 * description: 通过 `valueMapping` 和 `triggerMapping` 将组件的值和触发器映射到 `Form.Item` 的 `name` 和 `trigger` 上，实现组件与多个表单字段的绑定。
 */
import React from 'react';
import { Form, Input, Space } from 'antd';
import { FormItemMapping } from '@orca-fe/antd-plus';

type AddressProps = {
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  onProvinceChange?: (value: string) => void;
  onCityChange?: (value: string) => void;
  onDistrictChange?: (value: string) => void;
  onStreetChange?: (value: string) => void;
};

/** 地址组件 */
const Address = (props: AddressProps) => {
  const { province, street, onStreetChange, onDistrictChange, district, onProvinceChange, onCityChange, city } = props;
  return (
    <Space>
      <Input placeholder="省" value={province} onChange={e => onProvinceChange?.(e.target.value)} />
      <Input placeholder="市" value={city} onChange={e => onCityChange?.(e.target.value)} />
      <Input placeholder="区" value={district} onChange={e => onDistrictChange?.(e.target.value)} />
      <Input placeholder="街" value={street} onChange={e => onStreetChange?.(e.target.value)} />
    </Space>
  );
};

const Demo1 = () => (
  <div>
    <Form
      initialValues={{
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        street: '科技园',
        areaCode: '0755',
        number: '12345678',
        firstName: '张',
        lastName: '三',
      }}
      onValuesChange={(_, allValue) => {
        console.warn(allValue);
      }}
    >
      <Form.Item label="地址">
        <FormItemMapping
          valueMapping={{
            province: 'province',
            city: 'city',
            district: 'district',
            street: 'street',
          }}
          triggerMapping={{
            onProvinceChange: 'province',
            onCityChange: 'city',
            onDistrictChange: 'district',
            onStreetChange: 'street',
          }}
        >
          <Address />
        </FormItemMapping>
      </Form.Item>
    </Form>
  </div>
);

export default Demo1;
