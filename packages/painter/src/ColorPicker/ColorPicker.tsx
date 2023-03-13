import React, { useEffect, useState } from 'react';
import Color from 'color';
import type { InputProps } from 'antd/es/input';
import { RgbaStringColorPicker } from 'react-colorful';
import Tooltip from 'rc-tooltip';
import Trigger from 'rc-trigger';
import { useControllableValue, useLocalStorageState } from 'ahooks';
import { ContextMenu } from '@orca-fe/pocket';
import { CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { catcher, removeArrIndex } from '@orca-fe/tools';
import ColorPreview from '../ColorPreview';
import useStyle from './ColorPicker.style';
import useRcTooltipStyle from './RcTooltip.style';
import useRcPickerStyle from './RcPicker.style';

const colorDef = [
  '#000000',
  '#333333',
  '#666666',
  '#aaaaaa',
  '#cccccc',
  '#eeeeee',
  '#ffffff',
  '#cc0000',
  '#722ed1',
  '#2f54eb',
  '#1890ff',
  '#13c2c2',
  '#52c41a',
  '#fadb14',
  '#faad14',
  '#fa541c',
];

export interface ColorPickerProps extends Omit<InputProps, 'onChange'> {
  defaultValue?: string;
  value?: string;
  onChange?: (color: string) => void;
  localStorageKey?: string;
  size?: number;
}

const ColorPicker = (props: ColorPickerProps) => {
  const [value = '', setValue] = useControllableValue(props);
  const {
    className = '',
    localStorageKey = 'orca-color-picker-favourite',
    value: nouse,
    onChange,
    defaultValue,
    size,
    ...otherProps
  } = props;

  const styles = useStyle();
  useRcPickerStyle();
  useRcTooltipStyle();

  const [visible, setVisible] = useState(false);

  const [savedColor, setSavedColor] = useLocalStorageState<string[]>(
    localStorageKey,
    {
      defaultValue: [],
    },
  );

  const [color, setColor] = useState('#FFFFFF');
  useEffect(() => {
    setColor(value);
  }, [value]);
  // 校验颜色是否合法
  // const confirmColor = () => {
  //   if (!color) return;
  //   try {
  //     new Color(color);
  //     setValue(color);
  //   } catch (err) {
  //     setColor(value);
  //   }
  // };

  const renderColorPicker = () => {
    const color = catcher(() => {
      const [r, g, b, a = 1] = Color(value).array();
      return `rgba(${r},${g},${b},${a})`;
    }, '');

    return (
      <span>
        <div
          className={styles.colorPickerContainer}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <RgbaStringColorPicker
            color={color}
            onChange={(color) => {
              const c = Color(color);
              const [r, g, b, a = 1] = c.array();
              if (a === 1) {
                setValue(c.hex());
              } else {
                setValue(`rgba(${r}, ${g}, ${b}, ${a})`);
              }
            }}
          />
          {/* 预设颜色 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 5,
              marginTop: 8,
              width: 200,
            }}
          >
            {colorDef.map((color) => (
              <ColorPreview
                key={color}
                className={styles.colorDef}
                color={color}
                border
                onClick={() => {
                  setValue(color);
                }}
              />
            ))}
          </div>
          {/* 缓存颜色 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 5,
              marginTop: 8,
              width: 200,
            }}
          >
            {savedColor.map((color, index) => (
              <Tooltip
                key={`${color}${index}`}
                placement="top"
                mouseEnterDelay={0}
                mouseLeaveDelay={0.1}
                motion={{ motionName: 'rc-tooltip-zoom' }}
                overlay={color}
              >
                <ContextMenu
                  mainMenuMinWidth={80}
                  data={[
                    { key: 'delete', icon: <DeleteOutlined />, text: '删除' },
                    { key: 'clear', icon: <CloseOutlined />, text: '清空' },
                  ]}
                  onMenuClick={({ key }) => {
                    if (key === 'delete') {
                      setSavedColor(removeArrIndex(savedColor, index));
                    }
                    if (key === 'clear') {
                      setSavedColor([]);
                    }
                  }}
                  style={{ zIndex: 10000 }}
                >
                  <ColorPreview
                    className={styles.colorDef}
                    color={color}
                    border
                    onClick={() => {
                      setValue(color);
                    }}
                  />
                </ContextMenu>
              </Tooltip>
            ))}
            {/* 添加按钮 */}
            <Tooltip
              placement="top"
              mouseEnterDelay={0}
              mouseLeaveDelay={0.1}
              motion={{ motionName: 'rc-tooltip-zoom' }}
              overlay="保存为自定义颜色"
            >
              <div
                className={styles.colorDef}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #CCCCCC',
                }}
                onClick={() => {
                  try {
                    Color(value);
                    setSavedColor([...savedColor, value]);
                  } catch (error) {}
                }}
              >
                <PlusOutlined />
              </div>
            </Tooltip>
          </div>
        </div>
      </span>
    );
  };

  return (
    <Trigger
      action={['click']}
      popupVisible={visible}
      onPopupVisibleChange={setVisible}
      destroyPopupOnHide
      popupAlign={{
        points: ['tl', 'bl'],
        offset: [0, 3],
      }}
      popupTransitionName="rc-trigger-popup-zoom"
      {...otherProps}
      popupClassName={styles.wrapper}
      popup={renderColorPicker()}
    >
      <div
        className={`${className} ${styles.prefixPreview}`}
        onClick={() => {
          setVisible(true);
        }}
      >
        <ColorPreview
          className={styles.prefixPreviewColor}
          color={color}
          border="1px solid #999"
          size={size}
        />
      </div>
    </Trigger>
  );
};

export default ColorPicker;
