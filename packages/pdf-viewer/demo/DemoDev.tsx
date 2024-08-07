/**
 * title: 调试用例
 * description: 你需要使用 `usePdfViewerRef` 来加载 PDF 文件
 * debug: true
 */

import { useRef, useState } from 'react';
import type { PDFPainterPluginHandle, ShapeDataType } from '@orca-fe/pdf-viewer';
import PdfViewer, { PDFOpenFileButtonPlugin, PDFPainterPlugin, usePdfViewerRef, PDFMarkPlugin } from '@orca-fe/pdf-viewer';

const dataSource: ShapeDataType[][] = [
  [
    {
      "type": "mark",
      "x": 90.62429565049962,
      "y": 211.45196318889847,
      "width": 200.56173332509258,
      "height": 23.595498038246205,
      "rotate": 0,
      "markNum": 4,
      "strokeWidth": 1,
      "stroke": "#CC0000"
    },
    {
      "type": "mark",
      "x": 638.7658654620648,
      "y": 208.729405722947,
      "width": 79.86168566791014,
      "height": 26.318055504197673,
      "rotate": 0,
      "markNum": 5,
      "strokeWidth": 1,
      "stroke": "#CC0000"
    },
    {
      "type": "mark",
      "x": 100.60700635898839,
      "y": 352.11743226305845,
      "width": 398.4009091842336,
      "height": 19.965421416977506,
      "rotate": 0,
      "markNum": 36,
      "strokeWidth": 1,
      "stroke": "#CC0000"
    }
  ]
];

const Demo1 = () => {
  const pdfViewerRef = usePdfViewerRef();
  const painter = useRef<PDFPainterPluginHandle>(null);
  const painter2 = useRef<PDFPainterPluginHandle>(null);
  const [dataList, setMarkData] = useState<ShapeDataType[][]>(dataSource);

  const onDataChange = (_newDataList, action, pageIndex, index) => {
    setMarkData(_newDataList);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const { files } = e.target as HTMLInputElement;
          if (files?.length) {
            const file = files[0];
            const pdfViewer = pdfViewerRef.current;
            if (pdfViewer) {
              pdfViewer.close();
              pdfViewer.load(file);
            }
          }
        }}
      />
      <PdfViewer ref={pdfViewerRef} dropFile pdfJsParams={{ cMapUrl: '/pdfjs-bcmaps/' }} style={{ height: 600 }}>
        <PDFOpenFileButtonPlugin />

        <PDFMarkPlugin data={dataList} ref={painter} onDataChange={onDataChange} buttonName="畫圖標註" popupVisible={false} autoCheck={false} drawingPluginId="drawingPluginId1" />

        <PDFPainterPlugin ref={painter2} />
      </PdfViewer>
    </div>
  );
};

export default Demo1;
