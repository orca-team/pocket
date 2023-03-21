import type { PDFViewerContextType } from './context';
import PDFViewerContext, { usePageCoverRenderer } from './context';
import OpenFileButton from './OpenFileButton';
import PDFViewer from './PDFViewer';
import type { PDFPainterPluginProps, PDFPainterPluginHandle } from './plugins/PDFPainterPlugin';
import PDFPainterPlugin from './plugins/PDFPainterPlugin';
import type { PDFTooltipPluginHandle, PDFTooltipPluginProps } from './plugins/PDFTooltipPlugin';
import PDFTooltipPlugin from './plugins/PDFTooltipPlugin';
import type { ToolbarButtonProps } from './ToolbarButton';
import ToolbarButton from './ToolbarButton';
import ToolbarPortal from './ToolbarPortal';

export default PDFViewer;

export * from './PDFViewer';

export { ToolbarPortal };
export * from './ToolbarPortal';

export { OpenFileButton };
export * from './OpenFileButton';

export type { PDFViewerContextType };
export { PDFViewerContext };

export type { ToolbarButtonProps };
export { ToolbarButton };

export { usePageCoverRenderer };

// PDF 内置插件导出

export { PDFPainterPlugin };

export type { PDFPainterPluginHandle, PDFPainterPluginProps };

export { PDFTooltipPlugin };

export type { PDFTooltipPluginHandle, PDFTooltipPluginProps };
