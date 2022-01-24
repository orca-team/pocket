import React from 'react';
import useMemoizedFn from './useMemorizedFn';

type EventAttributes = Required<
  Omit<React.DOMAttributes<HTMLElement>, 'children' | 'dangerouslySetInnerHTML'>
>;

/**
 * 事件透传
 * 返回一个包含事件名的对象，用于监听组件的事件，但不影响事件向上抛出
 * 当你在编写组件时，你可能使用属性透传的方式将你的根组件的属性暴露到外部
 * 但如果你监听了根组件的某个事件，你就不得不在你的事件函数中，再将事件向外抛出
 * 使用本 hooks 可以无感实现这一逻辑
 * 示例：
 * const events = usePassThroughEvents(props, 'onMouseDown', () => {'balabala'});
 * // events will be: { onMouseDown: () => {'balabala'} }
 * <div {...events} />
 *
 * @param props 组件的全部属性
 * @param eventName 监听的事件名称
 * @param listener 事件处理函数
 * @param localReturn 是否直接 return 本函数的返回值
 */
export default function usePassThroughEvents<
  E extends keyof EventAttributes,
  P extends Record<string, any>,
>(
  props: P,
  eventName: E | string,
  listener: (event: EventAttributes[E]) => boolean | undefined,
  localReturn: boolean = false,
) {
  const persistListener = useMemoizedFn(function (
    this: unknown,
    ev: EventAttributes[E],
  ) {
    const res = listener.call(this, ev);
    if (props != null && typeof props[eventName] === 'function') {
      if (!localReturn) return props[eventName](ev);
    }
    return res;
  });
  return { [eventName]: persistListener } as Pick<
    Record<string, (ev: EventAttributes[E]) => void>,
    E
  >;
}
