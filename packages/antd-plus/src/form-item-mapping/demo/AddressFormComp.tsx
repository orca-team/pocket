import { Input, Space } from 'antd';
import React from 'react';
import { FormItemMapping } from '@orca-fe/antd-plus';

export type AddressValueType = {
  province?: string;
  city?: string;
  district?: string;
  street?: string;
};

export type AddressProps = AddressValueType & {
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

/**
 * 对地址组件进行封装
 * @param props
 * @constructor
 */
const AddressFormComp = (props: { provinceField?: string; cityField?: string; districtField?: string; streetField?: string }) => {
  const { provinceField = 'province', cityField = 'city', districtField = 'district', streetField = 'street' } = props;
  return (
    <FormItemMapping
      valueMapping={{
        province: provinceField,
        city: cityField,
        district: districtField,
        street: streetField,
      }}
      triggerMapping={{
        onProvinceChange: provinceField,
        onCityChange: cityField,
        onDistrictChange: districtField,
        onStreetChange: streetField,
      }}
    >
      <Address />
    </FormItemMapping>
  );
};

export default AddressFormComp;
