/* eslint-disable @typescript-eslint/no-explicit-any,react-hooks/rules-of-hooks */

import { useEffect, useRef, useState } from 'react';
import { EventEmitter } from 'events';

type Callback = (...args: any[]) => void;

type KeyFunctions = Record<string, Callback>;

export interface IEventEmitter<T extends KeyFunctions> {
  emit<EventName extends keyof T>(
    eventName: EventName,
    ...args: Parameters<T[EventName]>
  ): void;

  useSubscription<EventName extends keyof T>(
    eventName: EventName,
    callback: T[EventName],
  ): void;
}

export class EventEmitterWithHook<T extends KeyFunctions>
  implements IEventEmitter<T>
{
  private readonly eventEmitter = new EventEmitter();

  emit = <EventName extends keyof T>(eventName: EventName, ...args) => {
    this.eventEmitter.emit(eventName as string, ...args);
  };

  useSubscription = <EventName extends keyof T>(
    eventName: EventName,
    callback: T[EventName],
  ) => {
    const callbackRef = useRef<T[EventName]>(callback);
    callbackRef.current = callback;

    useEffect(() => {
      const callbackFn = (...args) => {
        if (callbackRef.current) {
          callbackRef.current(...args);
        }
      };
      this.eventEmitter.on(eventName as string, callbackFn);
      return () => {
        this.eventEmitter.off(eventName as string, callbackFn);
      };
    }, []);
  };
}

export default function useEventEmitter<
  T extends KeyFunctions,
>(): IEventEmitter<T> {
  const [eventEmitter] = useState(() => new EventEmitterWithHook<T>());
  return eventEmitter;
}
