import React, { useEffect, useMemo, useState } from 'react';
import { useDebounceFn, useMemoizedFn } from 'ahooks';
import useMemorizedFn from './useMemorizedFn';

const emptyFn = () => undefined;

export const PromisifyModalContext = React.createContext({
  ok: emptyFn as (...args: any[]) => void,
  cancel: emptyFn as () => void,
  destroy: emptyFn as () => void,
  minimize: emptyFn as () => void,
  resume: emptyFn as () => void,
  resolve: emptyFn as (...args: any[]) => void,
  update: emptyFn as (...args: any[]) => void,
});

export type UsePromisifyModalOptions = {

  /** 标记用于控制显隐的属性名称，默认为 open */
  openField?: string;

  /** 弹框的确认回调事件，触发该事件时，相当于 Promise.resolve(); */
  onOkField?: string;

  /** 弹框的关闭回调事件，触发该事件时，相当于 Promise 挂起，不再触发 resolve 流程 */
  onCloseField?: string;

  /** 关闭弹窗后卸载弹框示例的延迟（一般用于维持弹框消失时的动画） */
  destroyDelay?: number;

  /** 关闭弹框时，是否触发 Promise.reject()。默认情况下不触发，Promise 将永远保持 pending */
  rejectOnClose?: boolean;

  /** 当触发 onOk 时，但处于异步逻辑的过程中，对弹框组件注入一个 loading 属性，用于控制弹框确认按钮的 loading 效果 */
  confirmLoadingPropName?: string;
};

const readyVisible = 'data-promisify-modal-ready';

type AnyFunction = (...args: any[]) => any;

/**
 * 帮助你管理维护弹框的 open 状态，适用于 antd-modal 及基于 modal 封装的自定义弹框
 * 通过 show 方法，直接弹出 modal 即可。工具会自动接管 onOk 和 onCancel 事件，并更新 open
 * @param options
 */
export default function usePromisifyModal(options: UsePromisifyModalOptions = {}) {
  const {
    openField = 'open',
    onOkField = 'onOk',
    onCloseField = 'onCancel',
    confirmLoadingPropName = 'confirmLoading',
    destroyDelay = 300,
    rejectOnClose,
  } = options;

  const [instance, setInstance] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    if (instance?.props[readyVisible]) {
      setInstance(
        React.cloneElement(instance, {
          [openField]: true,
          [readyVisible]: false,
        }),
      );
    }
  }, [instance]);

  const destroyAfterClose = useDebounceFn(
    () => {
      setInstance(null);
    },
    { wait: destroyDelay },
  );

  const [_this] = useState({
    ok: (() => {}) as AnyFunction | undefined,
    cancel: (() => {}) as AnyFunction | undefined,
    resolveFn: (() => {}) as AnyFunction | undefined,

    // 原始的 onOk 事件
    originOnOk: (() => {}) as AnyFunction | undefined,
    // 原始的 onCancel 事件
    originOnCancel: (() => {}) as AnyFunction | undefined,
  });

  /**
   * 更新当前弹框实例的属性
   */
  const update = useMemorizedFn((props: any) => {
    const newProps = { ...props };
    // 特殊处理，onOk 和 onCancel 已经被代理，不得通过 update 直接设置到组件实例
    if (onOkField && typeof newProps[onOkField] === 'function') {
      _this.originOnOk = newProps[onOkField];
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete newProps[onOkField];
    }
    if (onCloseField && typeof newProps[onCloseField] === 'function') {
      _this.originOnCancel = newProps[onCloseField];
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete newProps[onCloseField];
    }

    setInstance(instance => (instance ? React.cloneElement(instance, newProps) : null));
  });

  const clearThis = () => {
    _this.ok = undefined;
    _this.cancel = undefined;
    _this.resolveFn = undefined;
    _this.originOnOk = undefined;
    _this.originOnCancel = undefined;
  };

  const destroy = useMemorizedFn(() => {
    clearThis();
    update({ [openField]: false });
    destroyAfterClose.run();
  });

  const minimize = useMemorizedFn(() => {
    update({ [openField]: false });
  });

  const resume = useMemorizedFn(() => {
    update({ [openField]: true });
  });

  const open = useMemorizedFn(<T>(element: React.ReactElement = instance!) => {
    let ok: (value: T) => void = () => {};
    let cancel: () => void = () => {};
    let resolveFn: (value: T) => void = () => {};
    clearThis();

    const extendHandler = () => ({
      hide: destroy,
      destroy,
      ok,
      cancel,
      resolve: resolveFn,
    });

    if (!element) {
      // 未传入组件实例
      const p = Promise.reject(new Error('Empty show'));
      Object.assign(p, extendHandler());
      return p as typeof p & ReturnType<typeof extendHandler>;
    }
    destroyAfterClose.cancel();
    const key = new Date().getTime();

    // 在 open 时，记录下原始的 element 的 onOk 和 onCancel 事件，用于回调
    if (onOkField && typeof element.props[onOkField] === 'function') {
      _this.originOnOk = element.props[onOkField];
    }
    if (onCloseField && typeof element.props[onCloseField] === 'function') {
      _this.originOnCancel = element.props[onCloseField];
    }

    const handler = new Promise<T>((resolve, reject) => {
      const onOkHandler = (...args) => {
        if (typeof _this.originOnOk === 'function') {
          const res = _this.originOnOk.apply(null, args);
          if (res instanceof Promise) {
            if (confirmLoadingPropName) {
              update({ [confirmLoadingPropName]: true });
            }
            return res
              .then((r) => {
                destroy();
                if (r !== undefined) {
                  resolve(r);
                } else {
                  resolve(args[0]);
                }
                return r;
              })
              .catch(() => {
                if (confirmLoadingPropName) {
                  update({ [confirmLoadingPropName]: false });
                }
              });
          } else if (res === false) {
            return undefined;
          }
          destroy();
          resolve(args[0]);
          return res;
        }
        destroy();
        resolve(args[0]);

        return undefined;
      };
      // 代理 onCancel 事件
      const onCancelHandler = (...args) => {
        destroy();
        if (rejectOnClose) {
          reject(new Error('close'));
        }
        _this.originOnCancel?.apply(null, args);
        return undefined;
      };
      ok = onOkHandler;
      cancel = onCancelHandler;
      resolveFn = resolve;
      const newElement = React.cloneElement(element, {
        key,
        [openField]: false,
        [readyVisible]: true,
        ...(onOkField ? { [onOkField]: onOkHandler } : {}),
        ...(onCloseField ? { [onCloseField]: onCancelHandler } : {}),
      });
      setInstance(newElement);
    });

    Object.assign(handler, extendHandler());
    _this.ok = ok;
    _this.cancel = cancel;
    _this.resolveFn = resolveFn;
    return handler as typeof handler & ReturnType<typeof extendHandler>;
  });

  const ok = useMemoizedFn((...args: any[]) => {
    _this.ok?.(...args);
  });

  const cancel = useMemoizedFn((...args: any[]) => {
    _this.cancel?.(...args);
  });

  const resolve = useMemoizedFn((...args: any[]) => {
    _this.resolveFn?.(...args);
  });

  const instanceWithContext = React.createElement(
    PromisifyModalContext.Provider,
    {
      value: useMemo(
        () => ({
          cancel,
          destroy,
          minimize,
          resume,
          ok,
          resolve,
          update,
        }),
        [],
      ),
    },
    instance,
  );

  return {
    show: open,
    open,
    hide: destroy,
    destroy,
    instance: instanceWithContext,
    resume,
    minimize,
    ok,
    cancel,
    resolve,
    update,
  };
}

export const usePromisifyDrawer = (options: UsePromisifyModalOptions = {}) =>
  usePromisifyModal({
    onCloseField: 'onClose',
    onOkField: '',
    ...options,
  });
