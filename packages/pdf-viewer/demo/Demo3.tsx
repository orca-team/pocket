/**
 * title: 获取/设置绘图数据
 * description: 使用状态接管 `PDFPainterPlugin` 的数据
 */

import React, { useState } from 'react';
import type { ShapeDataType } from '@orca-fe/pdf-viewer';
import PdfViewer, {
  OpenFileButton,
  PDFOpenFileButtonPlugin,
  PDFPainterPlugin,
  ToolbarButton,
  ToolbarPortal,
  usePdfViewerRef,
} from '@orca-fe/pdf-viewer';
import { Tooltip } from 'antd';
import { ClearOutlined, ImportOutlined, SaveOutlined } from '@ant-design/icons';
import saveAs from 'file-saver';

const Page = () => {
  const pdfViewerRef = usePdfViewerRef();
  const [data, setData] = useState<ShapeDataType[][]>([]);

  return (
    <div>
      <PdfViewer ref={pdfViewerRef} dropFile pdfJsParams={{ cMapUrl: '/pdfjs-bcmaps/' }} style={{ height: 600 }}>
        <PDFOpenFileButtonPlugin />
        <ToolbarPortal>
          <Tooltip title="加载绘图数据">
            <OpenFileButton
              onOpenFile={(file) => {
                file.text().then((content) => {
                  setData(JSON.parse(content));
                });
              }}
            >
              <ImportOutlined />
            </OpenFileButton>
          </Tooltip>
        </ToolbarPortal>
        <ToolbarPortal>
          <Tooltip title="获取并保存绘图数据">
            <ToolbarButton
              icon={<SaveOutlined />}
              onClick={() => {
                saveAs(new Blob([JSON.stringify(data)]), 'data.json');
              }}
            />
          </Tooltip>
        </ToolbarPortal>
        <ToolbarPortal>
          <Tooltip title="清除绘图数据">
            <ToolbarButton
              icon={<ClearOutlined />}
              onClick={() => {
                setData([]);
              }}
            />
          </Tooltip>
        </ToolbarPortal>
        <PDFPainterPlugin data={data} onDataChange={setData} />
      </PdfViewer>
    </div>
  );
};

export default Page;
