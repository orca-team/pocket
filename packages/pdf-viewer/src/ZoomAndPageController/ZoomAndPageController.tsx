import React, { useContext } from 'react';
import { UcInput } from '@orca-fe/pocket';
import useStyles from './ZoomAndPageController.style';
import ZoomEditor from '../ZoomEditor';
import PDFViewerContext from '../context';

export interface ZoomAndPageControllerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  min?: number;
}

const ZoomAndPageController = (props: ZoomAndPageControllerProps) => {
  const { className = '', max, min, ...otherProps } = props;
  const styles = useStyles();
  const { changePage, pages, zoom, setZoom, current } =
    useContext(PDFViewerContext);
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
                changePage(current - 1);
              }
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (current < pages.length) {
                changePage(current + 1);
              }
            }
          }
        }}
        onChange={(value) => {
          if (!Number.isNaN(Number(value))) {
            changePage(Number(value));
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
          setZoom(Math.log2(zoomVal));
        }}
      />
    </div>
  );
};

export default ZoomAndPageController;
