import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useControllableProps, useMemorizedFn, usePassThroughEvents, useThis } from '@orca-fe/hooks';
import cn from 'classnames';
import useStyles from './LoadMore.style';

export interface LoadMoreProps extends React.HTMLAttributes<HTMLDivElement> {

  /** loading状态 */
  loading?: boolean;

  /** 自定义 loading 内容 */
  loadingComponent?: React.ReactNode;

  /** loading状态变化事件 */
  onLoadingChange?: (loading: boolean) => void;

  /** 是否还有更多 */
  hasMore?: boolean;

  /** 是否还有更多变化事件(非受控模式下生效) */
  onHasMoreChange?: (hasMore: boolean) => void;

  /** 加载更多事件 */
  onLoadMore?: (pageNum: number) => Promise<false | unknown> | boolean | undefined;

  /** 组件初始化时自动加载 */
  loadOnMount?: boolean;

  /** 默认页码 */
  defaultPage?: number;

  /** 当前页码 */
  page?: number;

  /** 页码变化事件 */
  onPageChange?: (page: number) => void;

  /** 禁用无限加载 */
  disabled?: boolean;

  /** 加载更多文案 */
  loadMoreText?: string;

  /** 无更多内容文案 */
  noMoreText?: string;

  /** loading状态变化延时（防止状态变化过快，在页面未完成加载时又加载了下一页数据 */
  loadingDelay?: number;

  /** 当没有更多的时候，隐藏提示信息 */
  hideNoMore?: boolean;
}

const ef = () => false;
const LoadMore = React.forwardRef<HTMLDivElement, LoadMoreProps>(({ defaultPage = 0, ...props }, ref) => {
  const [debounceLoadLock, setDebounceLoadLock] = useState<boolean>(false);
  const [
    {
      className = '',
      children,
      loading,
      hasMore,
      onLoadMore = ef,
      page,
      loadOnMount = true,
      disabled = false,
      loadMoreText = '下拉加载更多',
      noMoreText = '没有更多了',
      loadingDelay = 500,
      hideNoMore,
      loadingComponent = 'Loading...',
      ...otherProps
    },
    changeProps,
  ] = useControllableProps(props, {
    page: defaultPage,
    loading: false,
    hasMore: true,
  });

  const styles = useStyles();
  const isDebounceLoading = loading || debounceLoadLock;

  const _this = useThis({ loadLock: false });

  const rootRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => rootRef.current!);

  useEffect(() => {
    let timer: number;
    if (!loading) {
      _this.loadLock = false;
      timer = window.setTimeout(() => {
        setDebounceLoadLock(false);
      }, loadingDelay);
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [loading]);

  const triggerLoadMore = useMemorizedFn(() => {
    if (!hasMore) return;
    if (!_this.loadLock) {
      _this.loadLock = true;
      setDebounceLoadLock(true);
      changeProps({ loading: true });
      const res = onLoadMore(page + 1);
      if (res === false) {
        changeProps({ loading: false, hasMore: false });
      } else if (res instanceof Promise) {
        res.then((result) => {
          if (result === false) {
            changeProps({ loading: false, hasMore: false });
          } else {
            changeProps({ loading: false, hasMore: true, page: page + 1 });
          }
        });
      } else {
        changeProps({ loading: false, page: page + 1 });
      }
    }
  });

  const checkNeedLoadMore = useMemorizedFn(() => {
    if (!hasMore || isDebounceLoading || disabled) return;
    if (rootRef.current && loadingRef.current) {
      const { clientHeight, scrollHeight, scrollTop } = rootRef.current;
      const { clientHeight: loadingHeight } = loadingRef.current;
      const needLoadMore = scrollHeight <= scrollTop + clientHeight + loadingHeight;
      if (needLoadMore) {
        triggerLoadMore();
      }
    }
  });

  useEffect(() => {
    if (loadOnMount) {
      triggerLoadMore();
    }
  }, []);

  const rootEvents = {
    ...usePassThroughEvents(props, 'onScroll', () => {
      checkNeedLoadMore();
      return undefined;
    }),
    ...usePassThroughEvents(props, 'onWheel', (event) => {
      if (event.deltaY > 0) {
        checkNeedLoadMore();
      }
      return undefined;
    }),
  };

  return (
    <div ref={rootRef} className={cn(styles.root, className)} {...otherProps} {...rootEvents}>
      {children}
      {!disabled && !(hideNoMore && !hasMore) && (
        <div
          ref={loadingRef}
          className={cn(styles.loadingContent, {
            [styles.canLoadMore]: hasMore,
            [styles.noMore]: !hasMore,
          })}
          onClick={triggerLoadMore}
        >
          {isDebounceLoading && loadingComponent}
          {!isDebounceLoading && (hasMore ? loadMoreText : noMoreText)}
        </div>
      )}
    </div>
  );
});

export default LoadMore;
