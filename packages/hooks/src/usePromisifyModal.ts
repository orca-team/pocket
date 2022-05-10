import React, { useEffect, useState } from 'react';
import { useDebounceFn } from 'ahooks';
import useMemorizedFn from './useMemorizedFn';

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
// export type OnOkType<T> = (result: T) => (void | boolean | Promise<void | boolean>);

export type UsePromisifyModalOptions = {
  visibleField?: string;
  onOkField?: string;
  onCloseField?: string;
  destroyDelay?: number;
  rejectOnClose?: boolean;
};

const readyVisible = 'data-promisify-modal-ready';

/**
 * 帮助你管理维护弹框的 visible 状态，适用于 antd-modal 及基于 modal 封装的自定义弹框
 * 通过 show 方法，直接弹出 modal 即可。工具会自动接管 onOk 和 onCancel 事件，并更新 visible
 * @param options
 */
export default function usePromisifyModal(
  options: UsePromisifyModalOptions = {},
) {
  const {
    visibleField = 'visible',
    onOkField = 'onOk',
    onCloseField = 'onCancel',
    destroyDelay = 500,
    rejectOnClose,
  } = options;

  const [instance, setInstance] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    if (instance?.props[readyVisible]) {
      setInstance(
        React.cloneElement(instance, {
          [visibleField]: true,
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

  const hide = useMemorizedFn(() => {
    setInstance((instance) =>
      instance ? React.cloneElement(instance, { [visibleField]: false }) : null,
    );
    destroyAfterClose.run();
  });

  const show = useMemorizedFn((element: React.ReactElement) => {
    destroyAfterClose.cancel();
    const key = new Date().getTime();

    const handler = new Promise((resolve, reject) => {
      const newElement = React.cloneElement(element, {
        key,
        [visibleField]: false,
        [readyVisible]: true,
        [onOkField]: (...args) => {
          if (typeof element.props[onOkField] === 'function') {
            const res = element.props[onOkField].apply(null, args);
            if (res instanceof Promise) {
              setInstance((instance) =>
                instance
                  ? React.cloneElement(instance, { confirmLoading: true })
                  : null,
              );
              return res
                .then((r) => {
                  hide();
                  resolve(args[0]);
                  return r;
                })
                .catch(() => {
                  setInstance((instance) =>
                    instance
                      ? React.cloneElement(instance, { confirmLoading: false })
                      : null,
                  );
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
        },
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
    return handler as typeof handler & { hide: () => void };
  });

  return { show, hide, instance };
}

export const usePromisifyDrawer = (options: UsePromisifyModalOptions = {}) => {
  const { onCloseField = 'onClose', ...otherOptions } = options;
  return usePromisifyModal({
    onCloseField,
    ...otherOptions,
  });
};
