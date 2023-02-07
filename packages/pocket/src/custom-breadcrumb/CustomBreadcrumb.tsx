import { useContext, useEffect } from 'react';
import Breadcrumb from './Breadcrumb';
import type { BaseMenuType } from './BreadcrumbContext';
import BreadcrumbContext, { BreadCrumbProvider } from './BreadcrumbContext';

export interface CustomBreadCrumbProps extends BaseMenuType {}

const CustomBreadcrumb = (props: CustomBreadCrumbProps) => {
  const { add, remove } = useContext(BreadcrumbContext);

  const { path, text, order } = props;
  useEffect(() => {
    const menuObj = { path, text, order };
    add(menuObj);
    return () => {
      remove(menuObj);
    };
  }, [path, text, order]);

  return null;
};

CustomBreadcrumb.Renderer = Breadcrumb;
CustomBreadcrumb.Context = BreadcrumbContext;
CustomBreadcrumb.Provider = BreadCrumbProvider;

export default CustomBreadcrumb;
