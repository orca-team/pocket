import React, { useContext } from 'react';
import printJS from 'print-js';
import PDFContextMenuPlugin from '../PDFContextMenuPlugin';
import PDFViewerContext from '../../context';

export interface PdfContextPrintPluginProps {}

const PdfContextPrintPlugin = (props: PdfContextPrintPluginProps) => {
  const { pdfViewer } = useContext(PDFViewerContext);
  return (
    <PDFContextMenuPlugin
      menu={[
        {
          key: 'print',
          text: '打印',
          onClick: async () => {
            const data = await pdfViewer.getPDFInstance()?.getData();
            if (data) {
              const blob = new Blob([data.buffer], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              printJS(url);
              URL.revokeObjectURL(url);
            }
          },
        },
      ]}
    />
  );
};

export default PdfContextPrintPlugin;
