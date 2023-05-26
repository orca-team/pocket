import React from 'react';

export const actionStack: HotkeyActionType[] = [];

/**
 * 快捷键对象
 */
export type HotkeyActionType = {
  // 快捷键名称
  hotkeyName: string;
  // 回调
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  action: (event: KeyboardEvent) => void | boolean;
  // 监听对象
  target?: () => HTMLElement | undefined;
  // 是否监听 input
  input?: boolean;
  // 事件传递，默认不开启，事件被第一个监听器捕获之后就不会继续传递
  through?: boolean;
};

export type HotkeyManagerContextType = {
  registerHotkeyAction: (action: HotkeyActionType) => () => void;
  unregisterHotkeyAction: (action: HotkeyActionType) => void;
};

const HotkeyManagerContext = React.createContext<HotkeyManagerContextType>({
  registerHotkeyAction: () => () => undefined,
  unregisterHotkeyAction: () => undefined,
});

export default HotkeyManagerContext;
