import type { PropsWithChildren } from 'react';
import React, { useContext, useState, createContext } from 'react';
import { useMemoizedFn } from 'ahooks';

export type AsyncTask = () => Promise<void> | void;

export type PriorityCallbackType<T> = (queue: [AsyncTask, T][]) => number;

const defaultPriorityCallback: PriorityCallbackType<any> = () => 0;

export type AsyncQueueOptions<T> = {
  limit?: number;
  priorityCallback?: PriorityCallbackType<T>;
};

export class AsyncQueue<T = any> {
  protected queue: [AsyncTask, T][] = [];
  protected limit = 1;
  protected running = 0;
  protected priorityCallback: PriorityCallbackType<T>;

  constructor(options: AsyncQueueOptions<T> = {}) {
    const { limit = 1, priorityCallback = defaultPriorityCallback } = options;
    this.limit = limit;
    this.priorityCallback = priorityCallback;
  }

  protected next() {
    while (this.running < this.limit) {
      const nextTaskIndex = this.priorityCallback(this.queue);
      const task = this.queue[nextTaskIndex];
      if (!task) {
        // 没有下一个任务，暂停
        break;
      }
      this.queue.splice(nextTaskIndex, 1);
      // 执行
      const [taskFn] = task;
      if (typeof taskFn === 'function') {
        this.running++;
        const result = taskFn();
        if (result instanceof Promise) {
          // 等待异步结果
          result.finally(() => {
            this.running--;
            this.next();
          });
        } else {
          this.running--;
          this.next();
        }
      }
    }
  }

  add(task: AsyncTask, params: T) {
    this.queue.push([task, params]);
    this.next();
  }

  cancel(taskOrParams: AsyncTask | T) {
    this.queue = this.queue.filter(([task, params]) => task !== taskOrParams && params !== taskOrParams);
  }
}

export type AsyncQueueParams = { index: number };

export const AsyncQueueContext = createContext<{
  queue?: AsyncQueue<AsyncQueueParams>;
}>({});

export const useAsyncQueue = (params: AsyncQueueParams) => {
  const { queue } = useContext(AsyncQueueContext);

  const addTask = useMemoizedFn((task: AsyncTask) => {
    queue?.add(task, params);
    return () => {
      queue?.cancel(task);
    };
  });

  return { addTask };
};

const AsyncQueueProvider = (
  props: PropsWithChildren<{
    priorityCallback?: PriorityCallbackType<AsyncQueueParams>;
  }>,
) => {
  const { children, priorityCallback } = props;

  const [contextValue] = useState(() => ({
    queue: new AsyncQueue({
      priorityCallback,
    }),
  }));

  return <AsyncQueueContext.Provider value={contextValue}>{children}</AsyncQueueContext.Provider>;
};

export default AsyncQueueProvider;
