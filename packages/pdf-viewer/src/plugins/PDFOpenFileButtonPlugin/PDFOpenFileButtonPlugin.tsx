import React, { useContext } from 'react';
import type { ToolbarPortalProps } from '../../ToolbarPortal';
import ToolbarPortal from '../../ToolbarPortal';
import OpenFileButton from '../../OpenFileButton';
import PDFViewerContext from '../../context';

export interface PdfOpenFileButtonPluginProps extends ToolbarPortalProps {}

const PDFOpenFileButtonPlugin = (props: PdfOpenFileButtonPluginProps) => {
  const { ...otherProps } = props;
  const { pdfViewer } = useContext(PDFViewerContext);
  return (
    <ToolbarPortal placement="left" alwaysShow {...otherProps}>
      <OpenFileButton
        onOpenFile={(file) => {
          if (file.name.endsWith('.pdf')) {
            pdfViewer.load(file, {
              title: file.name,
            });
          }
        }}
      />
    </ToolbarPortal>
  );
};

export default PDFOpenFileButtonPlugin;
