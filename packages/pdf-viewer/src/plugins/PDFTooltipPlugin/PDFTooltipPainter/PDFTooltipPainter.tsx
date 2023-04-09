import React, { useRef, useState } from 'react';
import { useClickAway, useControllableValue } from 'ahooks';
import { changeArr, removeArrIndex } from '@orca-fe/tools';
import { IconButton, Trigger } from '@orca-fe/pocket';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import cn from 'classnames';
import { useCombineKeyListener } from '@orca-fe/hooks';
import useStyles from './PDFTooltipPainter.style';
import type { TooltipDataType } from '../def';
import PDFTooltip from '../PDFTooltip';
import type { ShapeCreatorProps } from '../TooltipCreator';
import TooltipCreator from '../TooltipCreator';
import SimplePropsEditor from '../../SimplePropsEditor';
import type { PropsType } from '../../SimplePropsEditor/def';
import PopupBox from '../../PopupBox';

const eArr = [];

const ef = () => undefined;

const propsDef: PropsType[] = [
  {
    key: 'color',
    type: 'color',
    name: '顏色',
  },
  {
    key: 'fontSize',
    type: 'number',
    min: 10,
    max: 50,
    step: 1,
    name: '字號',
  },
];

export interface PDFTooltipPainterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultChecked' | 'onChange'> {
  drawing?: boolean;
  onDrawChange?: (drawing: boolean) => void;
  defaultData?: TooltipDataType[];
  data?: TooltipDataType[];
  onDataChange?: (data: TooltipDataType[], action: 'add' | 'change' | 'delete', index: number) => void;
  defaultChecked?: number;
  checked?: number;
  onCheck?: (index: number) => void;
  zoom?: number;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  autoCheck?: boolean;
  initialAttr?: ShapeCreatorProps['initialAttr'];
  onChangeStart?: (index: number) => void;
}

const PDFTooltipPainter = (props: PDFTooltipPainterProps) => {
  const {
    className = '',
    drawing,
    onDrawChange = ef,
    defaultData: nouse1,
    data: nouse2,
    onDataChange,
    checked: nouse3,
    defaultChecked: nouse4,
    onCheck,
    zoom = 0,
    getPopupContainer = () => document.body,
    autoCheck = true,
    initialAttr,
    onChangeStart = ef,
    ...otherProps
  } = props;
  const styles = useStyles();

  const [changing, setChanging] = useState(false);

  const [data = eArr, setData] = useControllableValue<TooltipDataType[]>(props, {
    defaultValue: [],
    trigger: 'onDataChange',
    valuePropName: 'data',
    defaultValuePropName: 'defaultData',
  });

  const [checked = -1, check] = useControllableValue<number>(props, {
    defaultValue: -1,
    trigger: 'onCheck',
    valuePropName: 'checked',
    defaultValuePropName: 'defaultChecked',
  });
  const [tmpTooltip, setTmpTooltip] = useState<TooltipDataType | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  useClickAway(() => {
    check(-1);
  }, rootRef);

  // 删除事件
  useCombineKeyListener(
    'Delete,Backspace',
    async () => {
      if (checked >= 0) {
        // // 修正下标
        // let i = checked;
        // if (i > 0) {
        //   i -= 1;
        // } else if (data.length === 1) {
        //   i = -1;
        // }
        check(-1);

        setData(removeArrIndex(data, checked), 'delete', checked);
      }
    },
    { target: rootRef },
  );

  return (
    <div ref={rootRef} tabIndex={-1} className={cn(styles.root, { [styles.drawing]: drawing }, className)} draggable={false} {...otherProps}>
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
            popupVisible={!changing && checked === index}
            getPopupContainer={getPopupContainer}
            popup={(
              <PopupBox>
                <SimplePropsEditor
                  value={{ fontSize, color }}
                  propsDef={propsDef}
                  onChange={(newProps) => {
                    setData(arr => changeArr(arr, index, { ...item, ...newProps }), 'change', index);
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setData(data => [...data, { ...item, x: item.x + 10, y: item.y + 40 }], 'change', index);
                      check(data.length);
                    }}
                    style={{ color: '#333' }}
                  >
                    <CopyOutlined />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      check(-1);
                      setData(data => removeArrIndex(data, index), 'delete', index);
                    }}
                    style={{ color: '#C00' }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </div>
              </PopupBox>
            )}
          >
            <PDFTooltip
              disabled={item.disabled}
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
              onChangeStart={() => {
                setChanging(true);
                onChangeStart(index);
              }}
              onChange={(item) => {
                setData(arr => changeArr(arr, index, item), 'change', index);
                setChanging(false);
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
          initialAttr={initialAttr}
          pointMapping={point => ({
            x: point.x / 2 ** zoom,
            y: point.y / 2 ** zoom,
          })}
          onDrawing={(tooltip) => {
            setTmpTooltip(tooltip);
          }}
          onCreate={(tooltip) => {
            setData(d => [...(d || []), tooltip], 'add', data.length);
            setTmpTooltip(null);
            if (autoCheck) {
              check(data.length);
              onDrawChange(false);
            }
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
