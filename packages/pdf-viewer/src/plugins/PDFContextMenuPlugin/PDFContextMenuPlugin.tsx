import { useContext, useEffect } from 'react';
import type { ContextMenuItemType } from '@orca-fe/pocket';
import { useMemoizedFn } from 'ahooks';
import PDFViewerContext from '../../context';

type MenuItemType = ContextMenuItemType & { order?: number };

export interface PDFContextMenuPluginProps {
  menu?: MenuItemType[] | ((page: number) => MenuItemType[]);
}

const PDFContextMenuPlugin = (props: PDFContextMenuPluginProps) => {
  const { menu } = props;
  const collectMenu = useMemoizedFn((page: number) => (typeof menu === 'function' ? menu(page) : menu));
  const { onMenuCollect, offMenuCollect } = useContext(PDFViewerContext);
  useEffect(() => {
    onMenuCollect(collectMenu);
    return () => {
      offMenuCollect(collectMenu);
    };
  });
  return null;
};

export default PDFContextMenuPlugin;
