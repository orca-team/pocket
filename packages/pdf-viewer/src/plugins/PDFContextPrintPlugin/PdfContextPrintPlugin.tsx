import React, { useContext } from 'react';
import printJS from 'print-js';
import { PrinterOutlined } from '@ant-design/icons';
import PDFContextMenuPlugin from '../PDFContextMenuPlugin';
import PDFViewerContext from '../../context';
import { useLocale } from '../../locale/context';
import zhCN from '../../locale/zh_CN';

export interface PdfContextPrintPluginProps {}

const PdfContextPrintPlugin = (props: PdfContextPrintPluginProps) => {
  const { pdfViewer } = useContext(PDFViewerContext);
  const [locale] = useLocale(zhCN);
  return (
    <PDFContextMenuPlugin
      menu={[
        {
          key: 'print',
          text: locale.printCurrentFile || '打印当前文件',
          icon: <PrinterOutlined />,
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
