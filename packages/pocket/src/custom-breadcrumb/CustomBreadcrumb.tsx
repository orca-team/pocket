import { useContext, useEffect } from 'react';
import Breadcrumb from './Breadcrumb';
import BreadcrumbContext, { BaseMenuType } from './BreadcrumbContext';

export interface BreadCrumbProps extends BaseMenuType {}

const CustomBreadcrumb = (props: BreadCrumbProps) => {
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

export default CustomBreadcrumb;
