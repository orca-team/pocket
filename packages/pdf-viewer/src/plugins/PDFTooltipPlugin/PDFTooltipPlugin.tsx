import React, { useContext, useImperativeHandle, useState } from 'react';
// import useStyles from './PDFTooltipPlugin.style';
import { useMemoizedFn } from 'ahooks';
import ToolbarButton from '../../ToolbarButton';
import { IconAddTooltip } from '../../icon/icon';
import PDFTooltipPainter from './PDFTooltipPainter';
import PDFViewerContext, { usePageCoverRenderer } from '../../context';
import ToolbarPortal from '../../ToolbarPortal';
import type { TooltipDataType } from './def';

// const eArr = [];

const ef = () => {};

export type PDFTooltipPluginHandle = {

  /** 获取所有批注内容 */
  getAllTooltipData: () => TooltipDataType[][];

  /** 设置某一页的批注内容 */
  setTooltipData: (page: number, markData: TooltipDataType[]) => void;

  /** 设置所有页面的批注内容 */
  setAllTooltipData: (markData: TooltipDataType[][]) => void;

  /** 清除所有页面的批注内容 */
  clearAllTooltipData: () => void;

  /** 开始绘制批注 */
  drawTooltip: (attr?: Record<string, any>) => void;

  /** 取消绘图 */
  cancelDraw: () => void;

  /** 取消所有选中 */
  cancelCheck: () => void;
};

export interface PDFTooltipPluginProps {
  onCheck?: () => void;
  onDraw?: () => void;
}

const PDFTooltipPlugin = React.forwardRef<PDFTooltipPluginHandle, PDFTooltipPluginProps>((props, pRef) => {
  const { onCheck = ef, onDraw = ef } = props;
  const renderPageCover = usePageCoverRenderer();
  const { pdfViewer } = useContext(PDFViewerContext);

  const [drawing, setDrawing] = useState(false);
  const [checkInfo, setCheckInfo] = useState({ page: -1, index: -1 });

  const [_this] = useState<{
    // 绘图数据
    data: TooltipDataType[][];
  }>({
    data: [],
  });

  const drawTooltip = useMemoizedFn<PDFTooltipPluginHandle['drawTooltip']>(() => {
    setDrawing(true);
  });
  const cancelDraw = useMemoizedFn<PDFTooltipPluginHandle['cancelDraw']>(() => {
    setDrawing(false);
  });
  const clearAllTooltipData = useMemoizedFn<PDFTooltipPluginHandle['clearAllTooltipData']>(() => {
    _this.data = [];
  });
  const getAllTooltipData = useMemoizedFn<PDFTooltipPluginHandle['getAllTooltipData']>(() => _this.data);
  const setTooltipData = useMemoizedFn<PDFTooltipPluginHandle['setTooltipData']>((pageIndex, data) => {
    _this.data[pageIndex] = data;
  });
  const setAllTooltipData = useMemoizedFn<PDFTooltipPluginHandle['setAllTooltipData']>((data) => {
    _this.data = data;
  });
  const cancelCheck = useMemoizedFn<PDFTooltipPluginHandle['cancelCheck']>(() => {
    setCheckInfo({ page: -1, index: -1 });
  });
  useImperativeHandle(pRef, () => ({
    drawTooltip,
    cancelDraw,
    clearAllTooltipData,
    getAllTooltipData,
    setTooltipData,
    setAllTooltipData,
    cancelCheck,
  }));

  return (
    <>
      <ToolbarPortal>
        <ToolbarButton
          checked={drawing}
          onClick={(e) => {
            if (!drawing) {
              pdfViewer.cancelDraw();
            }
            setDrawing(!drawing);
          }}
          icon={<IconAddTooltip />}
        >
          批注
        </ToolbarButton>
      </ToolbarPortal>
      {renderPageCover((pageIndex, { viewport, zoom }) => (
        <PDFTooltipPainter
          defaultData={_this.data[pageIndex]}
          onChange={(data) => {
            _this.data[pageIndex] = data;
            onDraw();
            // 绘制完成，取消绘图
            setDrawing(false);
          }}
          checked={checkInfo.page === pageIndex ? checkInfo.index : -1}
          onCheck={(index) => {
            setCheckInfo((checkInfo) => {
              if (index >= 0) {
                return {
                  page: pageIndex,
                  index,
                };
              } else if (checkInfo.page === pageIndex) {
                return {
                  page: pageIndex,
                  index,
                };
              }
              return checkInfo;
            });
            if (index >= 0) {
              onCheck();
            }
          }}
          drawing={drawing}
          zoom={zoom}
        />
      ))}
    </>
  );
});

export default PDFTooltipPlugin;
