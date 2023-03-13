import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { PDFToolbarContext } from '../context';

export interface ToolbarPortalProps {
  placement?: 'left' | 'right';
  children?: React.ReactElement | React.ReactElement[];
}

const ToolbarPortal = (props: ToolbarPortalProps) => {
  const { placement = 'right', children } = props;
  const { getToolbarLeftDom, getToolbarRightDom } =
    useContext(PDFToolbarContext);
  const toolbarDom =
    placement === 'right' ? getToolbarRightDom() : getToolbarLeftDom();
  return <>{toolbarDom ? ReactDOM.createPortal(children, toolbarDom) : null}</>;
};

export default ToolbarPortal;
