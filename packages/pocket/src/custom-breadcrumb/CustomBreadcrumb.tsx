import { useContext, useEffect } from 'react';
import Breadcrumb from './Breadcrumb';
import type { BaseMenuType } from './BreadcrumbContext';
import BreadcrumbContext, { BreadCrumbProvider } from './BreadcrumbContext';

export interface CustomBreadCrumbProps extends BaseMenuType {
  replace?: boolean;
}

const CustomBreadcrumb = (props: CustomBreadCrumbProps) => {
  const { add, remove } = useContext(BreadcrumbContext);

  const { path, text, order, replace } = props;
  useEffect(() => {
    const menuObj = { path, text, order, replace };
    add(menuObj);
    return () => {
      remove(menuObj);
    };
  }, [path, text, order, replace]);

  return null;
};

CustomBreadcrumb.Renderer = Breadcrumb;
CustomBreadcrumb.Context = BreadcrumbContext;
CustomBreadcrumb.Provider = BreadCrumbProvider;

export default CustomBreadcrumb;
