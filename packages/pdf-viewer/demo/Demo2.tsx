/**
 * title: 自定义工具栏
 * description: 使用 ToolbarPortal 将你的按钮挂在到工具栏的位置
 */

import React from 'react';
import PdfViewer, {
  OpenFileButton,
  ToolbarPortal,
  usePdfViewerRef,
} from '@orca-fe/pdf-viewer';
import { IconButton } from '@orca-fe/pocket';
import { InfoOutlined } from '@ant-design/icons';
import { message } from 'antd';

const Page = () => {
  const pdfViewerRef = usePdfViewerRef();
  return (
    <div>
      <PdfViewer ref={pdfViewerRef} style={{ height: 600 }}>
        {/* 在左侧添加一个打开文件的按钮 */}
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
        {/* 在右侧添加一个自定义按钮 */}
        <ToolbarPortal placement="right">
          <IconButton
            onClick={() => {
              message.info('你点击了自定义按钮');
            }}
          >
            <InfoOutlined />
          </IconButton>
        </ToolbarPortal>
      </PdfViewer>
    </div>
  );
};

export default Page;
