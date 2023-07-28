/**
 * title: FormItemMappingValue
 * description: 这个 Demo 用了一个新组件，展示 `FormItemMappingValue` 和 `FormItemMapping` 的差异
 */
import React from 'react';
import { Form } from 'antd';
import { FormItemMappingValue } from '@orca-fe/antd-plus';
import type { AddressValueType } from './AddressFormComp';
import AddressFormComp from './AddressFormComp';

// 地址展示组件，该组件只接收一个 value 属性
const AddressDisplay = (props: { value?: AddressValueType }) => {
  const { value } = props;
  return (
    <div>
      {value?.province}
      {value?.city}
      {value?.district}
      {value?.street}
    </div>
  );
};

const Demo2 = () => (
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
        <AddressFormComp />
      </Form.Item>
      <FormItemMappingValue
        valueMapping={{
          province: 'province',
          city: 'city',
          district: 'district',
          street: 'street',
        }}
      >
        <AddressDisplay />
      </FormItemMappingValue>
    </Form>
  </div>
);

export default Demo2;
