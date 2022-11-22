/* eslint-disable react-hooks/rules-of-hooks,@typescript-eslint/no-explicit-any */
import EventEmitter from 'events';
import { useEffect, useRef, useState } from 'react';
import { useMemorizedFn } from '@orca-fe/hooks';

export function shallowEquals(obj1: any, obj2: any) {
  if (obj1 === obj2) return true;
  if (obj1 && obj2 && typeof obj1 === 'object' && typeof obj2 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (let i = 0; i < keys1.length; i++) {
      const key = keys1[i];
      if (obj1[key] !== obj2[key]) return false;
    }

    return true;
  }
  return false;
}

export default class CommonStore<T extends Record<any, any>> {
  protected events = new EventEmitter();
  protected prevState: T;
  protected state: T;

  constructor(defaultState: T) {
    this.prevState = defaultState;
    this.state = defaultState;
  }

  protected setState(state: Partial<T>) {
    this.prevState = this.state;
    this.state = {
      ...this.state,
      ...state,
    };
    this.events.emit('state-changed');
  }

  /**
   * 获取最新的状态
   */
  getState() {
    return this.state;
  }

  /**
   * 在函数组件中订阅状态变化
   */
  useState<SubState extends T = T>(
    callback: (state: T) => SubState = (v) => v,
  ) {
    const [store, setStore] = useState<SubState>(() =>
      callback({ ...this.state }),
    );
    const handler = useMemorizedFn(() => {
      // 事件变化，触发
      const newStore = callback({ ...this.state });
      if (!shallowEquals(store, newStore)) {
        setStore(newStore);
      }
    });
    useEffect(() => {
      this.events.on('state-changed', handler);
      return () => {
        this.events.off('state-changed', handler);
      };
    }, []);
    return store;
  }

  /**
   * 在函数中监听事件变化
   * @param eventName 事件名称
   * @param callback
   */
  useEventListener(eventName: string, callback: (...args: any[]) => void) {
    const callbackFnRef = useRef(callback);
    useEffect(() => {
      const handler = (...args: any[]) => {
        callbackFnRef.current(...args);
      };
      this.events.on(eventName, handler);
      return () => {
        this.events.off(eventName, handler);
      };
    }, []);
  }

  useStateChangedListener(callback: (prevState: T, state: T) => void) {
    this.useEventListener('state-changed', () => {
      callback(this.prevState, this.state);
    });
  }
}
