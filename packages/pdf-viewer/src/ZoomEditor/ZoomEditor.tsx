import React from 'react';
import { SimpleNumberInput } from '@orca-fe/pocket';
import { CaretDownOutlined } from '@ant-design/icons';
import { useControllableValue } from 'ahooks';
import { Dropdown, Menu } from 'antd';
import useStyles from './ZoomEditor.style';

const ef = () => {};

export interface ZoomEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  min?: number;
  zoomMode?: false | 'autoWidth' | 'autoHeight';
  onZoomModeChange?: (zoomMode: false | 'autoWidth' | 'autoHeight') => void;
}

const ZoomEditor = (props: ZoomEditorProps) => {
  const {
    className = '',
    defaultValue: nouse1,
    value: nouse2,
    onChange,
    min = 2 ** -4,
    max = 2 ** 3,
    zoomMode = false,
    onZoomModeChange = ef,
    ...otherProps
  } = props;
  const styles = useStyles();
  const [value = 1, setValue] = useControllableValue(props);

  return (
    <div className={`${styles.root} ${className}`} {...otherProps}>
      <Dropdown
        overlay={(
          <Menu>
            <Menu.Item
              onClick={() => {
                onZoomModeChange(false);
                setValue(25 / 100);
              }}
            >
              25%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onZoomModeChange(false);
                setValue(50 / 100);
              }}
            >
              50%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onZoomModeChange(false);
                setValue(75 / 100);
              }}
            >
              75%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onZoomModeChange(false);
                setValue(100 / 100);
              }}
            >
              100%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onZoomModeChange(false);
                setValue(125 / 100);
              }}
            >
              125%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onZoomModeChange(false);
                setValue(150 / 100);
              }}
            >
              150%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onZoomModeChange(false);
                setValue(200 / 100);
              }}
            >
              200%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onZoomModeChange(false);
                setValue(400 / 100);
              }}
            >
              400%
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onZoomModeChange('autoWidth');
              }}
            >
              自动宽度
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                onZoomModeChange('autoHeight');
              }}
            >
              自动高度
            </Menu.Item>
          </Menu>
        )}
      >
        <div className={styles.zoomControl}>
          {zoomMode ? (
            {
              autoWidth: '自动宽度',
              autoHeight: '自动高度',
            }[zoomMode]
          ) : (
            <>
              <SimpleNumberInput
                className={styles.text}
                min={min * 100}
                max={max * 100}
                value={Math.trunc(value * 100)}
                onChange={(value) => {
                  onZoomModeChange(false);
                  setValue(value / 100);
                }}
              />
              %
            </>
          )}
          <CaretDownOutlined className={styles.icon} />
        </div>
      </Dropdown>
    </div>
  );
};

export default ZoomEditor;
