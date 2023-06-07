import React from 'react';
import cn from 'classnames';
import useStyle from './LoadingDiv.style';

export interface LoadingDivProps extends React.HTMLAttributes<HTMLDivElement> {

  /** 自定义 loading 组件 */
  loadingComponent?: React.ReactElement;

  /** 配置 loading 的背景颜色 */
  loadingBackgroundColor?: string;

  /** 是否绝对定位 */
  absolute?: boolean;

  /** 是否正在加载 */
  loading?: boolean;
}

const LoadingDiv = (props: LoadingDivProps) => {
  const { className = '', children, loadingComponent = 'loading...', absolute, loading, loadingBackgroundColor, ...otherProps } = props;
  const styles = useStyle();
  return (
    <div
      className={`${cn(styles.root, {
        [styles.absMode]: absolute,
      })} ${className}`}
      {...otherProps}
    >
      {children}
      <div className={cn(styles.loadingContent, { [styles.loading]: loading })} style={{ backgroundColor: loadingBackgroundColor }}>
        {loadingComponent}
      </div>
    </div>
  );
};

export default LoadingDiv;
