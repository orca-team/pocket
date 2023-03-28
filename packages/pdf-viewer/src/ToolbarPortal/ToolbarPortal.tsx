import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useCounter } from 'ahooks';
import PDFViewerContext, { PDFToolbarContext } from '../context';

let index = 0;

export interface ToolbarPortalProps {
  placement?: 'left' | 'center' | 'right';
  children?: React.ReactElement | React.ReactElement[];
  order?: number;
  alwaysShow?: boolean;
}

const ToolbarPortal = (props: ToolbarPortalProps) => {
  const { placement = 'center', children, order, alwaysShow } = props;

  const { pages } = useContext(PDFViewerContext);
  const { toolbarRightDom, toolbarLeftDom, removeCenterToolbarId, addCenterToolbarId, centerToolbarIds } = useContext(PDFToolbarContext);

  const [id] = useState(() => `pdfViewerToolbar_${Date.now()}${index++}`);

  const [, { inc: refresh }] = useCounter(0);

  const show = alwaysShow || pages.length > 0;
  useEffect(() => {
    if (show && placement === 'center') {
      addCenterToolbarId(id, order);
      return () => {
        removeCenterToolbarId(id);
      };
    }
    return undefined;
  }, [placement, order, show]);

  useEffect(() => {
    refresh();
  }, [centerToolbarIds]);

  let toolbarDom: HTMLElement | null = null;
  if (placement === 'left') toolbarDom = toolbarLeftDom;
  if (placement === 'right') toolbarDom = toolbarRightDom;
  if (placement === 'center') toolbarDom = document.getElementById(id);

  if (toolbarDom == null) return null;

  if (!show) return null;
  return <>{toolbarDom ? ReactDOM.createPortal(children, toolbarDom) : null}</>;
};

export default ToolbarPortal;
