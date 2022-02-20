import React, { useMemo, useState } from 'react';
import { findSelectedMenu } from '../menu-layout/menuUtils';

const eArr = [];

type BaseMenuType = {
  path?: string;
  text?: string;
};

type MenuType = BaseMenuType & {
  children?: MenuType[];
};

export type BreadCrumbContextType = {
  menu: MenuType[];
};

const BreadcrumbContext = React.createContext<BreadCrumbContextType>({
  menu: [],
});

export const BreadCrumbProvider = (props: { children: React.ReactNode; menu?: MenuType[]; pathname?: string }) => {
  const {
    menu = eArr,
    children,
    pathname = '',
  } = props;

  const [customBreadcrumb, setCustomBreadcrumb] = useState([]);

  const menuPath = useMemo(() => findSelectedMenu(pathname, menu), [menu, pathname]);

  return (
    <BreadcrumbContext.Provider value={{ menu: menuPath }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbContext;
