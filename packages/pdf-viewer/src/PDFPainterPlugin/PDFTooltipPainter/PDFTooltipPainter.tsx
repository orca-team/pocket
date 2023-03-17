import React, { useState } from 'react';
import { useControllableValue } from 'ahooks';
import { changeArr } from '@orca-fe/tools';
import useStyles from './PDFTooltipPainter.style';
import PDFTooltip from './PDFTooltip';
import TooltipCreator from './TooltipCreator';
import type { TooltipDataType } from './def';

const eArr = [];

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
      onBlur={() => {
        check(-1);
      }}
      {...otherProps}
    >
      {data.map((item, index) => (
        <PDFTooltip
          key={index}
          editable={checked === index}
          pointMapping={point => ({
            x: point.x / 2 ** zoom,
            y: point.y / 2 ** zoom,
          })}
          onClick={() => {
            if (checked !== index) {
              check(index);
            }
          }}
          data={item}
          onChange={(item) => {
            setData(arr => changeArr(arr, index, item));
          }}
        />
      ))}
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
