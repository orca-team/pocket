import { useMemoizedFn } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import type { HotkeyDefsType } from './hotkey-manager/utils';
import { createHotkeyCache, formatHotKeyStr, isInput, isMac, toHotkeyStr } from './hotkey-manager/utils';
import { registerGlobal } from './utils/syncGlobal';

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
  target?: () => HTMLElement | undefined | null;
  // 是否监听 input
  input?: boolean;
  // 事件传递，默认不开启，事件被第一个监听器捕获之后就不会继续传递
  through?: boolean;
  // 优先级
  priority?: number;
  // 临时禁用
  disabled?: boolean;
};

/**
 * 热键库
 */
export const defaultHotkeyDef: HotkeyDefsType = {
  copy: ['Ctrl+C', 'Command+C'],
  paste: ['Ctrl+V', 'Command+V'],
  cut: ['Ctrl+X', 'Command+X'],
  undo: ['Ctrl+Z', 'Command+Z'],
  save: ['Ctrl+S', 'Command+S'],
  redo: [
    ['Ctrl+Shift+Z', 'Ctrl+Y'],
    ['Command+Shift+Z', 'Command+Y'],
  ],
  confirm: ['Ctrl+Enter', 'Command+Enter'],
  delete: ['Delete', ['Delete', 'Backspace']],
  escape: ['Escape'],
};

const mapping = createHotkeyCache(defaultHotkeyDef);

export const actionStack: HotkeyActionType[] = [];

const handleKeyDown = (e: KeyboardEvent) => {
  const hotkeyStr = toHotkeyStr(e);
  if (!hotkeyStr) return;
  const keyMapping = isMac() ? mapping.macHotkeyMapping : mapping.hotkeyMapping;
  const hotkeyName = keyMapping.get(hotkeyStr);

  if (window.sessionStorage.useHotkeyListenerDebug) {
    console.warn('hotkeyStr', hotkeyStr);
    console.warn('hotkeyName', hotkeyName);
  }

  // 在监听器中查找 action
  for (const action of actionStack) {
    // 禁用的监听器，跳过
    if (action.disabled) continue;
    // 匹配事件名称（允许直接匹配）
    if (hotkeyName === action.hotkeyName || hotkeyStr === action.hotkeyName) {
      const triggerTarget = e.target as HTMLElement;
      if (action.input === false) {
        // 不对 input 内的快捷键进行响应，不做处理，继续/退出
        if (isInput(triggerTarget)) {
          if (action.through) {
            continue;
          } else {
            break;
          }
        }
      }
      // 事件监听有限制父节点
      const parentNode = action.target?.();
      if (parentNode) {
        // 有指定父节点，但触发目标节点不在范围内，不做处理，继续/退出
        if (!parentNode.contains(e.target as HTMLElement)) {
          if (action.through) {
            continue;
          } else {
            break;
          }
        }
      }
      const through = action.action(e) ?? action.through ?? true;

      if (!through) {
        // 不传递事件，中断，并标记事件已被触发
        break;
      }
    }
  }
};

const unregisterHotkeyAction = (action) => {
  const index = actionStack.findIndex(item => item === action);
  if (index >= 0) {
    actionStack.splice(index, 1);
  }
  if (actionStack.length <= 0) {
    window.removeEventListener('keydown', handleKeyDown);
  }
};

const registerHotkeyAction = (action) => {
  if (actionStack.length <= 0) {
    window.addEventListener('keydown', handleKeyDown);
  }
  actionStack.unshift(action);
  actionStack.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return () => {
    unregisterHotkeyAction(action);
  };
};

// 将内容挂载到 window 上，避免多个包重复，导致无法共享，重复触发等问题
const globalObj = registerGlobal('__orca-hooks-useHotkeyListener-global', {
  mapping,
  unregisterHotkeyAction,
  registerHotkeyAction,
});

const useHotkeyListener = (
  _hotkeyName: string | [string, string],
  action: HotkeyActionType['action'],
  options: Omit<HotkeyActionType, 'hotkeyName' | 'action'> = {},
) => {
  const getOptionTarget = useMemoizedFn(() => options.target?.());
  const memoAction = useMemoizedFn(action);

  const [isMacEnv] = useState(() => isMac());

  const [actionObject] = useState<HotkeyActionType>({
    action: memoAction,
    hotkeyName: '',
    target: getOptionTarget,
  });

  const hotkeyName = (Array.isArray(_hotkeyName) ? _hotkeyName : [_hotkeyName, _hotkeyName])[isMacEnv ? 1 : 0];

  actionObject.hotkeyName = useMemo(() => formatHotKeyStr(hotkeyName), [hotkeyName]);
  actionObject.input = options.input;
  actionObject.through = options.through;
  actionObject.disabled = options.disabled;
  actionObject.priority = options.priority;

  useEffect(() => {
    globalObj.registerHotkeyAction(actionObject);
    return () => {
      globalObj.unregisterHotkeyAction(actionObject);
    };
  }, [actionObject.priority]);
};

/**
 * 更新预设快捷键
 * @param hotkeys
 */
useHotkeyListener.updateHotkeyDefs = (hotkeys: HotkeyDefsType) => {
  const { hotkeyMapping, macHotkeyMapping } = createHotkeyCache(hotkeys);
  globalObj.mapping.hotkeyMapping = hotkeyMapping;
  globalObj.mapping.macHotkeyMapping = macHotkeyMapping;
};

export default useHotkeyListener;
