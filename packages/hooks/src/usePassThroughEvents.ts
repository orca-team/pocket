import { usePersistFn } from 'ahooks';

export type Listener = (...args: any[]) => any;

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
  T extends Listener,
  P extends { [key: string]: any } = {},
  E extends string = string,
>(
  props: P,
  eventName: E,
  listener: T,
  localReturn: boolean = false,
): Pick<{ [key: string]: T }, E> {
  const persistListener = usePersistFn(function (this: any, ...args: any[]) {
    const res = listener.call(this, ...args);
    if (props != null && typeof props[eventName] === 'function') {
      if (!localReturn) return props[eventName](...args);
    }
    return res;
  });
  return <Pick<{ [key: string]: T }, E>>{ [eventName]: persistListener };
}
