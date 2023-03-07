/**
 * title: 基础用法
 * description: 你需要使用 `usePdfViewerRef` 来加载 PDF 文件
 */

import React from 'react';
import PdfViewer, { usePdfViewerRef } from '@orca-fe/pdf-viewer';

const Demo1 = () => {
  const pdfViewerRef = usePdfViewerRef();
  return (
    <div>
      <input
        type={'file'}
        onChange={(e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files?.length) {
            const file = files[0];
            const pdfViewer = pdfViewerRef.current;
            file.arrayBuffer().then((buffer) => {
              if (pdfViewer) {
                pdfViewer.load(buffer);
              }
            });
          }
        }}
      />
      <PdfViewer ref={pdfViewerRef} style={{ height: 600 }} />
    </div>
  );
};

export default Demo1;
