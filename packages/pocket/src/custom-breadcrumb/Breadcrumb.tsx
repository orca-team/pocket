import React, { useContext } from 'react';
import pc from 'prefix-classnames';
import './Breadcrumb.less';
import { Link } from 'react-router-dom';
import BreadcrumbContext from './BreadcrumbContext';

const px = pc('custom-breadcrumb');

const defaultSeparator = (
  <div className={px('default-separator')}>/</div>
);

export interface BreadCrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: React.ReactNode;
}

const Breadcrumb = (props: BreadCrumbProps) => {
  const {
    className = '',
    separator = defaultSeparator,
    ...otherProps
  } = props;
  const { menu } = useContext(BreadcrumbContext);

  return (
    <div className={`${px('root')} ${className}`} {...otherProps}>
      {
        menu.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && separator}
            {
              item.path && (index < menu.length - 1) ? (
                <Link to={item.path}>
                  {item.text}
                </Link>
              ) : (
                <div>{item.text}</div>
              )
            }
          </React.Fragment>
        ))
      }
    </div>
  );
};

export default Breadcrumb;
