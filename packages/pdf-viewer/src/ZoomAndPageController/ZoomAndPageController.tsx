import React, { useContext } from 'react';
import { UcInput } from '@orca-fe/pocket';
import type { ZoomEditorProps } from '../ZoomEditor';
import ZoomEditor from '../ZoomEditor';
import PDFViewerContext from '../context';
import useStyles from './ZoomAndPageController.style';

export interface ZoomAndPageControllerProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  min?: number;
  zoomMode?: ZoomEditorProps['zoomMode'];
  onZoomModeChange?: ZoomEditorProps['onZoomModeChange'];
}

const ZoomAndPageController = (props: ZoomAndPageControllerProps) => {
  const { className = '', max, min, zoomMode, onZoomModeChange, ...otherProps } = props;
  const styles = useStyles();
  const { pdfViewer, pages, zoom, current } = useContext(PDFViewerContext);
  return (
    <div className={`${styles.root} ${className}`} {...otherProps}>
      <UcInput
        className={styles.input}
        value={current + 1}
        size="small"
        style={{ width: 40 }}
        onKeyDown={(e) => {
          if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (current > 0) {
                pdfViewer.changePage(current - 1);
              }
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (current < pages.length) {
                pdfViewer.changePage(current + 1);
              }
            }
          }
        }}
        onChange={(value) => {
          if (!Number.isNaN(Number(value) - 1)) {
            pdfViewer.changePage(Number(value) - 1);
          }
        }}
      />
      <span>
        {'/ '}
        {pages.length}
      </span>
      <ZoomEditor
        className={styles.zoomEditor}
        max={max}
        min={min}
        value={2 ** zoom}
        onChange={(zoomVal) => {
          pdfViewer.setZoom(Math.log2(zoomVal));
        }}
        zoomMode={zoomMode}
        onZoomModeChange={onZoomModeChange}
      />
    </div>
  );
};

export default ZoomAndPageController;
