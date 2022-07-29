import React, { useMemo, useState } from 'react';
import { useMemorizedFn } from '@orca-fe/hooks';
import { findSelectedMenu } from '../menu-layout/menuUtils';

const eArr = [];

export type BaseMenuType = {
  path?: string;
  text?: React.ReactNode;
  order?: number;
};

export type BreadCrumbMenuType = BaseMenuType & {
  children?: BreadCrumbMenuType[];
};

export type BreadCrumbContextType = {
  menu: BreadCrumbMenuType[];
  add: (menu: BreadCrumbMenuType) => void;
  remove: (menu: BreadCrumbMenuType) => void;
  customBreadcrumb: BaseMenuType[];
};

const BreadcrumbContext = React.createContext<BreadCrumbContextType>({
  menu: [],
  customBreadcrumb: [],
  add: () => {},
  remove: () => {},
});

export const BreadCrumbProvider = (props: {
  children: React.ReactNode;
  menu?: BreadCrumbMenuType[];
  pathname?: string;
}) => {
  const { menu = eArr, children, pathname = '' } = props;

  const [customBreadcrumb, setCustomBreadcrumb] = useState<BaseMenuType[]>([]);

  const menuPath = useMemo(
    () => findSelectedMenu(pathname, menu),
    [menu, pathname],
  );

  const add = useMemorizedFn((menu: BaseMenuType) => {
    setCustomBreadcrumb([...customBreadcrumb, menu]);
  });

  const remove = useMemorizedFn((menu: BaseMenuType) => {
    setCustomBreadcrumb(customBreadcrumb.filter((item) => item !== menu));
  });

  return (
    <BreadcrumbContext.Provider
      value={{ menu: menuPath, add, remove, customBreadcrumb }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbContext;
