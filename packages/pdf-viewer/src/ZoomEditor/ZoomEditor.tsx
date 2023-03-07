import React from 'react';
import pc from 'prefix-classnames';
import { SimpleNumberInput } from '@orca-fe/pocket';
import { CaretDownOutlined } from '@ant-design/icons';
import { useControllableValue } from 'ahooks';
import { Dropdown, Menu } from 'antd';
import './ZoomEditor.less';

const px = pc('zoom-editor');

export interface ZoomEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  min?: number;
}

const ZoomEditor = (props: ZoomEditorProps) => {
  const {
    className = '',
    defaultValue: nouse1,
    value: nouse2,
    onChange,
    min = 2 ** -4,
    max = 2 ** 3,
    ...otherProps
  } = props;
  const [value = 1, setValue] = useControllableValue(props);

  return (
    <div className={`${px('root')} ${className}`} {...otherProps}>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item
              onClick={() => {
                setValue(25 / 100);
              }}
            >
              25%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setValue(50 / 100);
              }}
            >
              50%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setValue(75 / 100);
              }}
            >
              75%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setValue(100 / 100);
              }}
            >
              100%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setValue(125 / 100);
              }}
            >
              125%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setValue(150 / 100);
              }}
            >
              150%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setValue(200 / 100);
              }}
            >
              200%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setValue(400 / 100);
              }}
            >
              400%
            </Menu.Item>
          </Menu>
        }
      >
        <div className={px('zoom-control')}>
          <SimpleNumberInput
            className={px('text')}
            min={min * 100}
            max={max * 100}
            value={Math.trunc(value * 100)}
            onChange={(value) => {
              setValue(value / 100);
            }}
          />
          %
          <CaretDownOutlined className={px('icon')} />
        </div>
      </Dropdown>
    </div>
  );
};

export default ZoomEditor;
