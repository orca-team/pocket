import React, { useState } from 'react';
import { useControllableValue } from 'ahooks';
import { changeArr } from '@orca-fe/tools';
import { IconButton, Trigger } from '@orca-fe/pocket';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import useStyles from './PDFTooltipPainter.style';
import type { TooltipDataType } from '../def';
import PDFTooltip from '../PDFTooltip';
import TooltipCreator from '../TooltipCreator';
import SimplePropsEditor from '../../SimplePropsEditor';
import type { PropsType } from '../../SimplePropsEditor/def';
import PopupBox from '../../PopupBox';

const eArr = [];

const propsDef: PropsType[] = [
  {
    key: 'color',
    type: 'color',
    name: '颜色',
  },
  {
    key: 'fontSize',
    type: 'number',
    min: 10,
    max: 50,
    step: 1,
    name: '字号',
  },
];

export interface PDFTooltipPainterProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'defaultChecked' | 'onChange'
  > {
  drawing?: boolean;
  defaultData?: TooltipDataType[];
  data?: TooltipDataType[];
  onChange?: (data: TooltipDataType[]) => void;
  defaultChecked?: number;
  checked?: number;
  onCheck?: (index: number) => void;
  zoom?: number;
}

const PDFTooltipPainter = (props: PDFTooltipPainterProps) => {
  const {
    className = '',
    drawing,
    defaultData: nouse1,
    data: nouse2,
    onChange,
    checked: nouse3,
    defaultChecked: nouse4,
    onCheck,
    zoom = 0,
    ...otherProps
  } = props;
  const styles = useStyles();
  const [data = eArr, setData] = useControllableValue<TooltipDataType[]>(
    props,
    {
      defaultValue: [],
      trigger: 'onChange',
      valuePropName: 'data',
      defaultValuePropName: 'defaultData',
    },
  );
  const [checked = -1, check] = useControllableValue<number>(props, {
    defaultValue: -1,
    trigger: 'onCheck',
    valuePropName: 'checked',
    defaultValuePropName: 'defaultChecked',
  });
  const [tmpTooltip, setTmpTooltip] = useState<TooltipDataType | null>(null);

  return (
    <div
      tabIndex={-1}
      className={`${styles.root} ${className}`}
      draggable={false}
      onBlur={() => {
        // check(-1);
      }}
      {...otherProps}
    >
      {data.map((item, index) => {
        const fontSize = item.fontSize || 16;
        const color = item.color || '#C00';
        return (
          <Trigger
            key={index}
            popupAlign={{
              points: ['bl', 'tl'],
              offset: [0, -5],
            }}
            popupVisible={checked === index}
            getPopupContainer={node => node ?? document.body}
            popup={(
              <PopupBox>
                <SimplePropsEditor
                  value={{ fontSize, color }}
                  propsDef={propsDef}
                  onChange={(newProps) => {
                    setData(arr =>
                      changeArr(arr, index, { ...item, ...newProps }),
                    );
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton size="small" style={{ color: '#333' }}>
                    <CopyOutlined />
                  </IconButton>
                  <IconButton size="small">
                    <DeleteOutlined />
                  </IconButton>
                </div>
              </PopupBox>
            )}
          >
            <PDFTooltip
              editable={checked === index}
              pointMapping={point => ({
                x: point.x / 2 ** zoom,
                y: point.y / 2 ** zoom,
              })}
              onMouseDown={() => {
                if (checked !== index) {
                  check(index);
                }
              }}
              data={item}
              onChange={(item) => {
                setData(arr => changeArr(arr, index, item));
              }}
              color={color}
              style={{ fontSize }}
            />
          </Trigger>
        );
      })}
      {tmpTooltip && <PDFTooltip data={tmpTooltip} />}
      {drawing && (
        <TooltipCreator
          pointMapping={point => ({
            x: point.x / 2 ** zoom,
            y: point.y / 2 ** zoom,
          })}
          onDrawing={(tooltip) => {
            setTmpTooltip(tooltip);
          }}
          onCreate={(tooltip) => {
            setData(d => [...(d || []), tooltip]);
            setTmpTooltip(null);
          }}
          onCancel={() => {
            setTmpTooltip(null);
          }}
        />
      )}
    </div>
  );
};

export default PDFTooltipPainter;
