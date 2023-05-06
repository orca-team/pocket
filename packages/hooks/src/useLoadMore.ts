/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemoizedFn } from 'ahooks';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';

const eArr = [];

const loadMoreFlag: any = {};

export type FetchResult<T = any> = {
  data: T;
};

export const isFetchResult = (value: any): value is FetchResult => {
  if (value != null && typeof value === 'object') {
    if ('data' in value) {
      return true;
    }
  }
  return false;
};

export type PageResult<T> = {
  list: T[];
  total: number;
};

export const isPageResult = (value: any): value is PageResult<any> => {
  if (value != null && typeof value === 'object') {
    if ('total' in value && 'list' in value && Array.isArray(value.list) && typeof value.total === 'number') {
      return true;
    }
  }
  return false;
};

export interface ServiceHandler<Args extends any[], Result> {

  /** 发起新的请求 */
  run: (...args: Args) => Promise<PageResult<Result> | undefined>;

  loadMore: () => Promise<PageResult<Result> | undefined>;

  /** 列表数据 */
  data: Result[];

  page: number;

  hasMore: boolean;

  total: number;

  /** 异常（如果报错） */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;

  /** 正在请求状态 */
  loading: boolean;

  /** 本次请求所使用的参数 */
  params: Args | undefined;

  cancel: () => void;
}

export interface ServiceOptions<Args extends any[], ServiceResult, Result> {
  manual?: boolean;
  pageSize?: number;

  /** 初始化时的参数 */
  defaultParams?: Args;

  /** 请求成功时的回调事件 */
  onSuccess?: (data: PageResult<Result>, params: Args) => void;

  /** 請求結束后的回調事件（不論數據處理是否正常） */
  onFinish?: (data: ServiceResult, params: Args) => void;

  /** 请求失败时的回调事件 */
  onError?: (error: Error, params: Args) => void;

  /** 请求缓存的标识 */
  cacheKey?: string;

  /** 对结果进行格式化处理（默认会取出 result.data) */
  formatter?: (res: ServiceResult) => PageResult<Result>;

  stateMgr?: {
    state: ServiceState<Args, PageResult<Result>>;
    setState: Dispatch<SetStateAction<ServiceState<Args, PageResult<Result>>>>;
  };
}

type PageParams = {
  pageIndex: number;
  pageSize: number;
};

export type Service<Args extends any[], Result> = (pageParams: PageParams, ...args: Args) => Promise<Result>;

export type ServiceState<Args extends any[], Result> = {
  loading?: boolean;
  data?: Result;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  params?: Args;
  page?: number;
};

export type ServiceAttr = {
  // 标记组件是否被卸载
  unloaded: boolean;
  // 表示本次请求的票据
  ticket: number;
  loading: boolean;
};

export type FetchResultData<T> = T extends FetchResult<infer P> ? P : T;

export function defaultFormatter<T>(res: T): PageResult<FetchResultData<T>> {
  let t: any = res;
  if (isFetchResult(t)) {
    t = t.data;
  }

  if (isPageResult(t)) {
    return t;
  }

  throw new Error('[useLoadMore] Service result is not a page result. Please use formatter to convert the result to `PageResultType`.');
}

export function useLoadMore<Args extends any[], ServiceResult = any, Result = FetchResultData<ServiceResult>>(
  _service: Service<Args, ServiceResult>,
  options: ServiceOptions<Args, ServiceResult, Result> = {},
): ServiceHandler<Args, Result> {
  const {
    defaultParams = [] as unknown as Args,
    manual = false,
    pageSize = 10,
    onError,
    onSuccess,
    formatter = defaultFormatter,
    stateMgr,
    onFinish,
  } = options;

  const service = useMemoizedFn(_service);

  // 组件状态控制 start
  const [__state, __setState] = useState<ServiceState<Args, PageResult<Result>>>(() => ({
    loading: false,
    data: {
      list: [],
      total: 0,
    },
    page: 1,
    params: defaultParams,
  }));

  const state = stateMgr?.state ?? __state;
  const _setState = stateMgr?.setState ?? __setState;
  const _this = useRef<ServiceAttr>({
    unloaded: false,
    ticket: 0,
    loading: false,
  }).current;

  const setState = useMemoizedFn((newState: Partial<ServiceState<Args, PageResult<Result>>> = {}) => {
    if (!_this.unloaded) {
      _setState(state => ({ ...state, ...newState }));
    }
  });
  // 组件状态控制 end

  const { loading = false, data, error, params, page = 1 } = state;

  // 发起请求
  const load = useMemoizedFn(async (..._args: any[]) => {
    // 取第一个参数判断是否加载更多
    const isLoadMore = _args[0] === loadMoreFlag;

    // 取得参数（如果是加载更多，需要从 state 中取得参数）
    const args: Args = isLoadMore ? params ?? defaultParams : (_args as Args);

    const pageIndex = isLoadMore ? page + 1 : 1;

    const ticket = performance.now();
    _this.ticket = ticket;
    _this.loading = true;
    setState({ loading: true, error: undefined });
    try {
      const res = await service({ pageIndex, pageSize }, ...args);
      const formattedData = formatter(res) as PageResult<Result>;
      if (formattedData == null) {
        throw new Error('[useLoadMore] Formatted result is undefined');
      }
      if (_this.ticket === ticket) {
        // 请求结果有效
        _this.loading = false;
        setState({
          params: args,
          loading: false,
          data: isLoadMore
            ? {
              list: [...(data?.list ?? []), ...formattedData.list],
              total: formattedData.total,
            }
            : formattedData,
          page: pageIndex,
        });
        if (formattedData != null) {
          if (typeof onSuccess === 'function') {
            onSuccess(formattedData, args);
          }
        } else if (typeof onError === 'function') {
          onError(new Error('result is undefined'), args);
        }
        if (typeof onFinish === 'function') {
          onFinish(res, args);
        }
      } else {
        console.warn('Request response out date.');
      }
      return formattedData;
    } catch (error: any) {
      console.error(error);
      _this.loading = false;
      setState({
        data: {
          list: [],
          total: 0,
        },
        error,
        loading: false,
      });
      if (typeof onError === 'function') {
        onError(error, args);
      }
    }
    return undefined;
  });

  const run = useMemoizedFn(load as ServiceHandler<Args, Result>['run']);
  const loadMore = useMemoizedFn(async () => load(loadMoreFlag));

  const cancel = useMemoizedFn(() => {
    _this.ticket = Date.now();
  });

  useEffect(() => {
    _this.loading = false;
    _this.unloaded = false;
    // 如果 manual === false，则需要主动加载一次
    if (!manual) {
      load(...defaultParams);
    }
    return () => {
      _this.unloaded = true;
    };
  }, []);

  const list = data?.list ?? eArr;
  const total = data?.total || 0;
  return {
    loading,
    params,
    data: list,
    total,
    page,
    hasMore: list.length < total,
    error,
    run,
    loadMore,
    cancel,
  };
}

export default useLoadMore;
