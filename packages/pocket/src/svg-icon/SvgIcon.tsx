import React, { useMemo } from 'react';
import cn from 'classnames';
import useStyles from './SvgIcon.style';

const eArr = [];

export type IconDataType = Record<string, any> & {
  viewBox?: string;
  paths?: React.SVGAttributes<SVGPathElement>[];
};

export interface SvgIconProps extends React.SVGAttributes<SVGSVGElement> {

  /** 大小 */
  size?: number | string;

  /** 整体颜色 */
  color?: string;

  /** 图标配置 */
  icon: IconDataType;

  /** 覆盖自定义图标的 path 属性 */
  customPathProps?: React.SVGAttributes<SVGPathElement>[];

  /** 是否旋转 */
  spinning?: boolean;
}

const SvgIcon = React.forwardRef<SVGSVGElement, SvgIconProps>((props, pRef) => {
  const { className = '', customPathProps = eArr, spinning, color, size, icon, style, ...otherProps } = props;
  const styles = useStyles();

  // 构建 path
  const path = useMemo(
    () =>
      (icon.paths || eArr).map((pathProps, index) => {
        const customProps = customPathProps[index] || {};
        return <path key={index} {...pathProps} {...customProps} />;
      }),
    [icon, customPathProps],
  );

  return (
    <svg
      ref={pRef}
      className={cn(styles.root, { [styles.spinning]: spinning }, className)}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={icon.viewBox}
      style={{
        fontSize: size,
        fill: color,
        ...style,
      }}
      {...otherProps}
    >
      {path}
    </svg>
  );
});

export default SvgIcon;
