import React, { useEffect, useRef, useState } from 'react';
import Color from 'color';
import { RgbaStringColorPicker } from 'react-colorful';
import {
  useControllableValue,
  useEventListener,
  useLocalStorageState,
} from 'ahooks';
import { CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { catcher, removeArrIndex } from '@orca-fe/tools';
import type { TriggerProps } from '@orca-fe/pocket';
import { ContextMenu, Tooltip, Trigger } from '@orca-fe/pocket';
import ColorPreview from '../ColorPreview';
import useStyle from './ColorPicker.style';

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

export interface ColorPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'size'> {
  defaultValue?: string;
  value?: string;
  onChange?: (color: string) => void;
  localStorageKey?: string;
  size?: number;
  triggerProps?: Omit<TriggerProps, 'children' | 'popup'>;
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
    triggerProps,
    ...otherProps
  } = props;

  const styles = useStyle();

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

  const pickerRef = useRef<HTMLDivElement>(null);
  useEventListener(
    'click',
    (e) => {
      // e.stopPropagation();
    },
    { target: pickerRef },
  );
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
          ref={pickerRef}
          className={styles.colorPickerContainer}
          // onClick={(e) => {
          //   e.stopPropagation();
          //   e.nativeEvent.stopPropagation();
          //   console.log('click', 'stopPropagation');
          // }}
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
            {colorDef.map(color => (
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
              <Tooltip key={`${color}${index}`} placement="top" overlay={color}>
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
            <Tooltip placement="top" overlay="保存为自定义颜色">
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
      action="click"
      popupVisible={visible}
      onPopupVisibleChange={setVisible}
      popupClassName={styles.wrapper}
      popup={renderColorPicker()}
      {...triggerProps}
      popupAlign={{
        points: ['tl', 'bl'],
        offset: [0, 3],
        ...triggerProps?.popupAlign,
      }}
    >
      <div
        className={`${className} ${styles.prefixPreview}`}
        onClick={(e) => {
          setVisible(true);
          e.stopPropagation();
        }}
        {...otherProps}
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
