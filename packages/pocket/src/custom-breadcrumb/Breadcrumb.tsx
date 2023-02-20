import React, { useContext, useMemo } from 'react';
import pc from 'prefix-classnames';
import { Link } from 'react-router-dom';
import type { BaseMenuType } from './BreadcrumbContext';
import BreadcrumbContext from './BreadcrumbContext';

const px = pc('custom-breadcrumb');

const ef = () => {};

const defaultSeparator = <div className={px('default-separator')}>/</div>;

export interface BreadCrumbProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  prefix?: BaseMenuType;
  separator?: React.ReactNode;
  onLinkClick?: (link: BaseMenuType, e: React.MouseEvent) => void;
}

const Breadcrumb = (props: BreadCrumbProps) => {
  const {
    className = '',
    separator = defaultSeparator,
    prefix,
    onLinkClick = ef,
    ...otherProps
  } = props;
  const { menu, customBreadcrumb } = useContext(BreadcrumbContext);

  const menuWithPrefix = useMemo(() => {
    if (prefix) {
      if (menu.findIndex(({ path }) => path === prefix.path) < 0) {
        return [prefix, ...menu];
      }
    }
    return menu;
  }, [menu, prefix]);

  const finalMenu = useMemo(() => {
    let replaceFlag = false;
    return [...menuWithPrefix, ...customBreadcrumb]
      .map((item, index) => ({
        ...item,
        order: item.order != null ? item.order : index,
      }))
      .reverse()
      .filter((item) => {
        const replace = !replaceFlag;
        replaceFlag = !!item.replace;
        return replace;
      })
      .reverse();
  }, [menuWithPrefix, customBreadcrumb]);

  return (
    <div className={`${px('root')} ${className}`} {...otherProps}>
      {finalMenu.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && separator}
          {item.path && index < finalMenu.length - 1 ? (
            <Link
              className={px('link-item')}
              to={item.path}
              onClick={(e) => {
                onLinkClick(item, e);
              }}
            >
              {item.text}
            </Link>
          ) : (
            <div className={px('link-item', 'current')}>{item.text}</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
