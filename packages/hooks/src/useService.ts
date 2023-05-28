/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDocumentVisibility, useMemoizedFn } from 'ahooks';
import type { Dispatch, SetStateAction } from 'react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import useInterval from './useInterval';

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

export interface ServiceHandler<Args extends any[], Result> {

  /** 发起新的请求 */
  run: (...args: Args) => Promise<Result | undefined>;

  /** 本次请求的结果 */
  data: Result | undefined;

  /** 异常（如果报错） */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;

  /** 正在请求状态 */
  loading: boolean;

  /** 本次请求所使用的参数 */
  params: Args | undefined;

  /** 刷新上一次请求 */
  refresh: () => Promise<Result | undefined>;

  /** 修改接口的结果 */
  mutate: (result: SetStateAction<Result>) => void;

  /** 取消本次未完成的请求 */
  cancel: () => void;
}

export interface ContextOptions {

  /** 是否手动发起第一次请求 */
  manual?: boolean;

  /** 轮询间隔 */
  pollingInterval?: number;

  /** 在页面隐藏时，是否继续轮询 */
  pollingWhenHidden?: boolean;

  /** 如果请求失败，是否维持之前的结果，默认为 true */
  keepSuccessData?: boolean;
}

export const UseServiceContext = React.createContext<ContextOptions>({});

export interface ServiceOptions<Args extends any[], ServiceResult, Result = ServiceResult> extends ContextOptions {

  /** 默认结果 */
  initialData?: Result;

  /** 初始化时的参数 */
  defaultParams?: Args;

  /** 请求成功时的回调事件 */
  onSuccess?: (data: Result, params: Args) => void;

  /** 請求結束后的回調事件（不論數據處理是否正常） */
  onFinish?: (data: ServiceResult, params: Args) => void;

  /** 请求失败时的回调事件 */
  onError?: (error: Error, params: Args) => void;

  /** 请求缓存的标识 */
  cacheKey?: string;

  /** 对结果进行格式化处理（默认会取出 result.data) */
  formatter?: (res: ServiceResult) => Result;

  stateMgr?: {
    state: ServiceState<Args, Result>;
    setState: Dispatch<SetStateAction<ServiceState<Args, Result>>>;
  };
}

export type Service<Args extends any[], Result> = (...args: Args) => Promise<Result>;

export type ServiceState<Args extends any[], Result> = {
  loading?: boolean;
  data?: Result;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  params?: Args;
};

export type ServiceAttr = {
  // 标记组件是否被卸载
  unloaded: boolean;
  // 表示本次请求的票据
  ticket: number;
  loading: boolean;
};

const cache: Record<string, any> = {};

export type FetchResultData<T> = T extends FetchResult<infer P> ? P : T;

export function defaultFormatter<T>(res: T): FetchResultData<T> {
  if (isFetchResult(res)) {
    return res.data;
  }
  return res as FetchResultData<T>;
}

export function useService<Args extends any[], ServiceResult = any, Result = FetchResultData<ServiceResult>>(
  _service: Service<Args, ServiceResult>,
  options: ServiceOptions<Args, ServiceResult, Result> = {},
): ServiceHandler<Args, Result> {
  const globalOptions = useContext(UseServiceContext);
  const {
    defaultParams = [] as unknown as Args,
    initialData,
    manual = false,
    onError,
    onSuccess,
    cacheKey,
    keepSuccessData = true,
    formatter = defaultFormatter,
    pollingInterval = 0,
    pollingWhenHidden = false,
    stateMgr,
    onFinish,
  } = { ...globalOptions, ...options };

  const service = useMemoizedFn(_service);

  // 组件状态控制 start
  const [__state, __setState] = useState<ServiceState<Args, Result>>(() => ({
    loading: false,
    data: cache[cacheKey ?? ''] ?? initialData,
    params: defaultParams,
  }));

  const state = stateMgr?.state ?? __state;
  const _setState = stateMgr?.setState ?? __setState;
  const _this = useRef<ServiceAttr>({
    unloaded: false,
    ticket: 0,
    loading: false,
  }).current;

  const setState = useMemoizedFn((newState: Partial<ServiceState<Args, Result>> = {}) => {
    if (!_this.unloaded) {
      if (cacheKey != null && newState.data) {
        cache[cacheKey] = newState.data;
      }
      _setState(state => ({ ...state, ...newState }));
      // _setState({ ...state, ...newState });
    }
  });
  // 组件状态控制 end

  const { loading = false, data, error, params } = state;

  let refresh = () => Promise.resolve() as Promise<Result | undefined>;
  const visible = useDocumentVisibility();

  // 轮询
  const timer = useInterval(() => {
    if (visible || !pollingWhenHidden) {
      refresh();
    }
  }, pollingInterval || undefined);

  // 发起请求
  const load = useMemoizedFn(async (...args: Args) => {
    const ticket = performance.now();
    _this.ticket = ticket;
    _this.loading = true;
    setState({ loading: true, error: undefined });
    timer.reset();
    try {
      const res = await service(...args);
      let formattedData = formatter(res) as Result | undefined;
      if (keepSuccessData && formattedData == null) {
        formattedData = data;
      }
      if (_this.ticket === ticket) {
        // 请求结果有效
        _this.loading = false;
        setState({
          params: args,
          loading: false,
          data: formattedData,
        });
        if (formattedData != null) {
          if (typeof onSuccess === 'function') {
            onSuccess(formattedData, args);
          }
        } else if (typeof onError === 'function') {
          // 暂时禁用 onError 的触发逻辑，数据问题不做 Error 处理
          // onError(new Error('result is undefined'), args);
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
        data: undefined,
        error,
        loading: false,
      });
      if (typeof onError === 'function') {
        onError(error, args);
      }
    }
    return undefined;
  });

  refresh = useMemoizedFn(async () => {
    if (params) {
      return load(...params);
    }
    return undefined;
  });

  const mutate = useMemoizedFn((data: SetStateAction<Result>) => {
    if (_this.unloaded) return;
    _setState(oldState => ({
      ...oldState,
      // @ts-expect-error
      data: typeof data === 'function' ? data(oldState.data) : data,
    }));
  });

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

  return {
    loading,
    params,
    data,
    error,
    mutate,
    run: load,
    refresh,
    cancel,
  };
}

export default useService;
