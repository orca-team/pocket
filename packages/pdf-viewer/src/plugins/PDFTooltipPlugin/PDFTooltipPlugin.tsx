import React, { useState } from 'react';
// import useStyles from './PDFTooltipPlugin.style';
import ToolbarButton from '../../ToolbarButton';
import { IconMarkEdit } from '../../icon/icon';
import PDFTooltipPainter from './PDFTooltipPainter';
import { usePageCoverRenderer } from '../../context';
import ToolbarPortal from '../../ToolbarPortal';

// const eArr = [];

export interface PDFTooltipPainterProps {}

const PDFTooltipPlugin = (props: PDFTooltipPainterProps) => {
  // const styles = useStyles();

  const renderPageCover = usePageCoverRenderer();

  const [drawing, setDrawing] = useState(false);

  return (
    <>
      <ToolbarPortal>
        <ToolbarButton
          checked={drawing}
          onClick={(e) => {
            setDrawing(!drawing);
          }}
          icon={<IconMarkEdit />}
        >
          添加批注
        </ToolbarButton>
      </ToolbarPortal>
      {renderPageCover((pageIndex, { viewport, zoom }) => (
        <PDFTooltipPainter drawing={drawing} zoom={zoom} />
      ))}
    </>
  );
};

export default PDFTooltipPlugin;
