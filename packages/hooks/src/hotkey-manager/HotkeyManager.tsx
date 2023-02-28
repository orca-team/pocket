import { useEventListener, useMemoizedFn } from 'ahooks';
import React, { useMemo, useState } from 'react';
import type {
  HotkeyActionType,
  HotkeyManagerContextType,
} from './HotkeyManagerContext';
import HotkeyManagerContext from './HotkeyManagerContext';
import type { HotkeyDefsType } from './utils';
import { createHotkeyCache, isInput, isMac, toHotkeyStr } from './utils';

/**
 * 热键库
 */
const defaultHotkeyDef: HotkeyDefsType = {
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

export interface HotkeyManagerProps {
  hotkey?: HotkeyDefsType;
  children?: React.ReactNode;
  throughEvent?: boolean;
}

const HotkeyManager = (props: HotkeyManagerProps) => {
  const { children, hotkey = defaultHotkeyDef, throughEvent = false } = props;

  const { hotkeyMapping, macHotkeyMapping } = useMemo(
    () => createHotkeyCache(hotkey),
    [hotkey],
  );

  const [_this] = useState<{
    actionStack: HotkeyActionType[];
  }>({
    actionStack: [],
  });

  const unregisterHotkeyAction = useMemoizedFn<
    HotkeyManagerContextType['unregisterHotkeyAction']
  >((action) => {
    const index = _this.actionStack.findIndex((item) => item === action);
    if (index >= 0) {
      _this.actionStack.splice(index, 1);
    }
  });

  const registerHotkeyAction = useMemoizedFn<
    HotkeyManagerContextType['registerHotkeyAction']
  >((action) => {
    _this.actionStack.unshift(action);
    return () => {
      unregisterHotkeyAction(action);
    };
  });

  useEventListener('keydown', (e) => {
    const hotkeyStr = toHotkeyStr(e);
    const keyMapping = isMac() ? macHotkeyMapping : hotkeyMapping;
    const hotkeyName = keyMapping.get(hotkeyStr);
    // 通过快捷键，匹配到预设的名称
    if (hotkeyName) {
      // 在监听器中查找 action
      for (const action of _this.actionStack) {
        // 匹配事件名称
        if (hotkeyName === action.hotkeyName) {
          const triggerTarget = e.target as HTMLElement;
          if (action.input === false) {
            // 不对 input 内的快捷键进行响应，不做处理，继续/退出
            if (isInput(triggerTarget)) {
              if (action.through ?? throughEvent) {
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
              if (action.through ?? throughEvent) {
                continue;
              } else {
                break;
              }
            }
          }
          const through = action.action(e) ?? action.through ?? throughEvent;
          if (!through) {
            // 不传递事件，中断
            break;
          }
        }
      }
    }
  });

  return (
    <HotkeyManagerContext.Provider
      value={useMemo(
        () => ({
          registerHotkeyAction,
          unregisterHotkeyAction,
        }),
        [],
      )}
    >
      {children}
    </HotkeyManagerContext.Provider>
  );
};

export default HotkeyManager;
