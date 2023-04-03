/* eslint-disable react/no-unused-prop-types */
import React, { useContext, useImperativeHandle, useState } from 'react';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import { changeArr } from '@orca-fe/tools';
import ToolbarButton from '../../ToolbarButton';
import { IconAddTooltip } from '../../icon/icon';
import PDFTooltipPainter from './PDFTooltipPainter';
import PDFViewerContext, { usePageCoverRenderer } from '../../context';
import ToolbarPortal from '../../ToolbarPortal';
import type { TooltipDataType } from './def';

const eArr = [];

export type PDFTooltipPluginHandle = {
  defaultChecked?: [number, number];
  checked?: [number, number];
  onCheck?: (checked: [number, number]) => void;

  /** 开始绘制批注 */
  drawTooltip: (attr?: Record<string, any>) => void;

  /** 取消绘图 */
  cancelDraw: () => void;

  defaultData?: TooltipDataType[][];
  data?: TooltipDataType[][];
  onDataChange?: (data: TooltipDataType[][], action: 'add' | 'change' | 'delete', pageIndex: number, index: number) => void;
};

export interface PDFTooltipPluginProps {
  defaultChecked?: [number, number];
  checked?: [number, number];
  onCheck?: (checked: [number, number]) => void;
  defaultData?: TooltipDataType[][];
  data?: TooltipDataType[][];
  onDataChange?: (data: TooltipDataType[][], action: 'add' | 'change' | 'delete', pageIndex: number, index: number) => void;
}

const PDFTooltipPlugin = React.forwardRef<PDFTooltipPluginHandle, PDFTooltipPluginProps>((props, pRef) => {
  const renderPageCover = usePageCoverRenderer();

  const { pdfViewer } = useContext(PDFViewerContext);

  const [drawing, setDrawing] = useState(false);
  const [checked, setChecked] = useControllableValue<[number, number] | undefined>(props, {
    defaultValuePropName: 'defaultChecked',
    trigger: 'onCheck',
    valuePropName: 'checked',
  });

  const [dataList = eArr, setDataList] = useControllableValue<TooltipDataType[][]>(props, {
    defaultValuePropName: 'defaultData',
    trigger: 'onDataChange',
    valuePropName: 'data',
  });

  const drawTooltip = useMemoizedFn<PDFTooltipPluginHandle['drawTooltip']>(() => {
    setDrawing(true);
  });
  const cancelDraw = useMemoizedFn<PDFTooltipPluginHandle['cancelDraw']>(() => {
    setDrawing(false);
  });
  useImperativeHandle(pRef, () => ({
    drawTooltip,
    cancelDraw,
  }));

  return (
    <>
      <ToolbarPortal>
        <ToolbarButton
          checked={drawing}
          onClick={(e) => {
            setDrawing(!drawing);
          }}
          icon={<IconAddTooltip />}
        >
          批注
        </ToolbarButton>
      </ToolbarPortal>
      {renderPageCover((pageIndex, { viewport, zoom }) => (
        <PDFTooltipPainter
          data={dataList[pageIndex] || eArr}
          onDataChange={(pageData, action, index) => {
            setDataList(changeArr(dataList, pageIndex, pageData), action, pageIndex, index);
          }}
          checked={checked?.[0] === pageIndex ? checked[1] : undefined}
          onCheck={(index) => {
            setChecked((checked) => {
              if (index >= 0) {
                return [pageIndex, index];
              }
              if (checked && checked[0] !== pageIndex) {
                return checked;
              }
              return undefined;
            });
          }}
          drawing={drawing}
          zoom={zoom}
          getPopupContainer={() => pdfViewer.getRoot() || document.body}
        />
      ))}
    </>
  );
});

export default PDFTooltipPlugin;
