/**
 * title: 获取/设置绘图数据
 * description: 使用 `getAllMarkData` / `setAllMarkData` 获取/设置绘图数据。
 */

import React from 'react';
import PdfViewer, {
  OpenFileButton,
  ToolbarPortal,
  usePdfViewerRef,
} from '@orca-fe/pdf-viewer';
import { IconButton } from '@orca-fe/pocket';
import { Tooltip } from 'antd';
import { ClearOutlined, ImportOutlined, SaveOutlined } from '@ant-design/icons';
import saveAs from 'file-saver';

const Page = () => {
  const pdfViewerRef = usePdfViewerRef();

  const loadMarks = (content: string) => {
    try {
      const markDataList = JSON.parse(content);
      const pdfViewer = pdfViewerRef.current;
      if (pdfViewer) {
        pdfViewer.setAllMarkData(markDataList);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const saveMarks = () => {
    const pdfViewer = pdfViewerRef.current;
    if (pdfViewer) {
      const markDataList = pdfViewer.getAllMarkData();
      saveAs(new Blob([JSON.stringify(markDataList, null, 2)]), 'marks.json');
    }
  };
  const clearMarks = () => {
    const pdfViewer = pdfViewerRef.current;
    if (pdfViewer) {
      pdfViewer.clearAllMarkData();
    }
  };
  return (
    <div>
      <PdfViewer ref={pdfViewerRef} style={{ height: 600 }}>
        <ToolbarPortal placement="left">
          <OpenFileButton
            onOpenFile={(file) => {
              const pdfViewer = pdfViewerRef.current;
              if (pdfViewer) {
                pdfViewer.load(file);
              }
            }}
          />
        </ToolbarPortal>
        <ToolbarPortal>
          <Tooltip title="加载绘图数据">
            <IconButton>
              <OpenFileButton
                onOpenFile={(file) => {
                  file.text().then((content) => {
                    loadMarks(content);
                  });
                }}
              >
                <ImportOutlined />
              </OpenFileButton>
            </IconButton>
          </Tooltip>
          <Tooltip title="获取并保存绘图数据">
            <IconButton onClick={saveMarks}>
              <SaveOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="获取并保存绘图数据">
            <IconButton onClick={clearMarks}>
              <ClearOutlined />
            </IconButton>
          </Tooltip>
        </ToolbarPortal>
      </PdfViewer>
    </div>
  );
};

export default Page;
