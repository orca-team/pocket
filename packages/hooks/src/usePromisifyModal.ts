import React, { useEffect, useMemo, useState } from 'react';
import { useDebounceFn, useMemoizedFn } from 'ahooks';
import useMemorizedFn from './useMemorizedFn';

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
// export type OnOkType<T> = (result: T) => (void | boolean | Promise<void | boolean>);

export const PromisifyModalContext = React.createContext({
  ok: (() => {}) as (...args: any[]) => void,
  cancel: () => {},
  minimize: () => {},
  resume: () => {},
});

export type UsePromisifyModalOptions = {
  openField?: string;
  onOkField?: string;
  onCloseField?: string;
  destroyDelay?: number;
  rejectOnClose?: boolean;
};

const readyVisible = 'data-promisify-modal-ready';

/**
 * 帮助你管理维护弹框的 open 状态，适用于 antd-modal 及基于 modal 封装的自定义弹框
 * 通过 show 方法，直接弹出 modal 即可。工具会自动接管 onOk 和 onCancel 事件，并更新 open
 * @param options
 */
export default function usePromisifyModal(options: UsePromisifyModalOptions = {}) {
  const { openField = 'open', onOkField = 'onOk', onCloseField = 'onCancel', destroyDelay = 300, rejectOnClose } = options;

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
    ok: (() => {}) as ((...args: any[]) => void) | undefined,
  });

  const hide = useMemorizedFn(() => {
    _this.ok = undefined;
    setInstance(instance => (instance ? React.cloneElement(instance, { [openField]: false }) : null));
    destroyAfterClose.run();
  });

  const minimize = useMemorizedFn(() => {
    setInstance(instance => (instance ? React.cloneElement(instance, { [openField]: false }) : null));
  });

  const resume = useMemorizedFn(() => {
    setInstance(instance => (instance ? React.cloneElement(instance, { [openField]: true }) : null));
  });

  const show = useMemorizedFn(<T>(element: React.ReactElement = instance!) => {
    if (!element) return Promise.reject(new Error('Empty show'));
    destroyAfterClose.cancel();
    const key = new Date().getTime();

    let ok: (value: T) => void = () => {};

    const handler = new Promise<T>((resolve, reject) => {
      const onOkHandler = (...args) => {
        if (typeof element.props[onOkField] === 'function') {
          const res = element.props[onOkField].apply(null, args);
          if (res instanceof Promise) {
            setInstance(instance => (instance ? React.cloneElement(instance, { confirmLoading: true }) : null));
            return res
              .then((r) => {
                hide();
                if (r !== undefined) {
                  resolve(r);
                } else {
                  resolve(args[0]);
                }
                return r;
              })
              .catch(() => {
                setInstance(instance => (instance ? React.cloneElement(instance, { confirmLoading: false }) : null));
              });
          } else if (res === false) {
            return undefined;
          }
          hide();
          resolve(args[0]);
          return res;
        }
        hide();
        resolve(args[0]);

        return undefined;
      };
      ok = onOkHandler;
      const newElement = React.cloneElement(element, {
        key,
        [openField]: false,
        [readyVisible]: true,
        ...(onOkField
          ? {
            [onOkField]: onOkHandler,
          }
          : {}),
        [onCloseField]: (...args) => {
          hide();
          if (rejectOnClose) {
            reject(new Error('close'));
          }
          if (typeof element.props[onCloseField] === 'function') {
            return element.props[onCloseField].apply(null, args);
          }
          return undefined;
        },
      });
      setInstance(newElement);
    });

    handler['hide'] = hide;
    handler['ok'] = ok;
    _this.ok = ok;
    return handler as typeof handler & { hide: () => void; ok: typeof ok };
  });

  const ok = useMemoizedFn((...args: any[]) => {
    _this.ok?.(...args);
  });

  const instanceWithContext = React.createElement(
    PromisifyModalContext.Provider,
    {
      value: useMemo(
        () => ({
          cancel: hide,
          minimize,
          resume,
          ok,
        }),
        [],
      ),
    },
    instance,
  );

  return { show, hide, instance: instanceWithContext, resume, minimize, ok };
}

export const usePromisifyDrawer = (options: UsePromisifyModalOptions = {}) =>
  usePromisifyModal({
    onCloseField: 'onClose',
    onOkField: '',
    ...options,
  });
