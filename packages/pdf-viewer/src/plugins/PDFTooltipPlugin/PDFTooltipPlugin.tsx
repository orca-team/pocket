/* eslint-disable react/no-unused-prop-types */
import React, { useContext, useImperativeHandle } from 'react';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import { changeArr } from '@orca-fe/tools';
import { useHotkeyListener } from '@orca-fe/hooks';
import ToolbarButton from '../../ToolbarButton';
import { IconAddTooltip } from '../../icon/icon';
import type { PDFTooltipPainterProps } from './PDFTooltipPainter';
import PDFTooltipPainter from './PDFTooltipPainter';
import PDFViewerContext, { usePageCoverRenderer } from '../../context';
import ToolbarPortal from '../../ToolbarPortal';
import type { TooltipDataType } from './def';
import { useLocale } from '../../locale/context';
import zhCN from '../../locale/zh_CN';

const eArr = [];
const ef = () => undefined;

export type PDFTooltipPluginHandle = {

  /** 开始绘制批注 */
  drawTooltip: (attr?: Record<string, any>) => void;

  /** 取消绘图 */
  cancelDraw: () => void;
};

export interface PDFTooltipPluginProps {

  /** 默认选中的批注 */
  defaultChecked?: [number, number];

  /** 当前选中的批注 */
  checked?: [number, number];

  /** 选中批注时的回调函数 */
  onCheck?: (checked: [number, number]) => void;

  /** 默认数据 */
  defaultData?: TooltipDataType[][];

  /** 数据 */
  data?: TooltipDataType[][];

  /** 数据变化时的回调函数 */
  onDataChange?: (data: TooltipDataType[][], action: 'add' | 'change' | 'delete', pageIndex: number, index: number) => void;

  /** 是否自动选中 */
  autoCheck?: boolean;

  /** 初始属性 */
  initialAttr?: PDFTooltipPainterProps['initialAttr'];

  /** 开始更改时的回调函数 */
  onChangeStart?: (pageIndex: number, index: number) => void;

  /** 按钮名称 */
  buttonName?: string;
}

const drawingNamePDFTooltipPlugin = 'PDFTooltipPlugin';

const PDFTooltipPlugin = React.forwardRef<PDFTooltipPluginHandle, PDFTooltipPluginProps>((props, pRef) => {
  const [l] = useLocale(zhCN);
  const { autoCheck = true, initialAttr, onChangeStart = ef, buttonName = l.tooltip } = props;
  const renderPageCover = usePageCoverRenderer();

  const { pdfViewer, internalState, setInternalState } = useContext(PDFViewerContext);

  /* 绘图功能 */
  const drawing = internalState.drawingPluginName === drawingNamePDFTooltipPlugin;

  const setDrawing = useMemoizedFn((b: boolean) => {
    setInternalState({
      drawingPluginName: b ? drawingNamePDFTooltipPlugin : '',
    });
  });

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

  useHotkeyListener('Escape', () => {
    if (checked) {
      setChecked(undefined);
      return false;
    }
    if (drawing) {
      cancelDraw();
      return false;
    }
    return true;
  });

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
          {buttonName}
        </ToolbarButton>
      </ToolbarPortal>
      {renderPageCover((pageIndex, { viewport, zoom }) => (
        <PDFTooltipPainter
          initialAttr={initialAttr}
          autoCheck={autoCheck}
          data={dataList[pageIndex] || eArr}
          onChangeStart={(index) => {
            onChangeStart(pageIndex, index);
          }}
          onDataChange={(pageData, action, index) => {
            setDataList(changeArr(dataList, pageIndex, pageData), action, pageIndex, index);
          }}
          onDrawChange={setDrawing}
          checked={checked?.[0] === pageIndex ? checked[1] : undefined}
          onCheck={(index) => {
            const newCheck = (() => {
              if (index >= 0) {
                return [pageIndex, index] as [number, number];
              }
              if (checked && checked[0] !== pageIndex) {
                return checked;
              }
              return undefined;
            })();
            if (checked !== newCheck) {
              setChecked(newCheck);
            }
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
