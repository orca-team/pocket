import { UcInput } from '@orca-fe/pocket';
import { Space } from 'antd';
import React, { useContext } from 'react';
import PDFViewerContext from '../context';
import ZoomEditor from '../ZoomEditor';
import useStyle from './PDFToolbar.style';

export interface PdfToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  max?: number;
  min?: number;
  leftRef?: React.Ref<HTMLDivElement>;
  rightRef?: React.Ref<HTMLDivElement>;
}

const PDFToolbar = (props: PdfToolbarProps) => {
  const { className = '', max, min, rightRef, leftRef, ...otherProps } = props;
  const styles = useStyle();

  const { changePage, pages, zoom, setZoom, current } =
    useContext(PDFViewerContext);

  return (
    <div className={`${styles.root} ${className}`} {...otherProps}>
      <div ref={leftRef} className={styles.left}>
        {/* <IconButton>*/}
        {/*  <MenuOutlined />*/}
        {/* </IconButton>*/}
      </div>
      <div className={styles.center}>
        <Space>
          <UcInput
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
            max={max}
            min={min}
            value={2 ** zoom}
            onChange={(zoomVal) => {
              setZoom(Math.log2(zoomVal));
            }}
          />
        </Space>
      </div>
      <div ref={rightRef} className={styles.right} />
    </div>
  );
};

export default PDFToolbar;
