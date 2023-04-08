// deprecated
import { useEventListener } from 'ahooks';
import type React from 'react';
import { detect } from 'detect-browser';
import { useMemo } from 'react';
import type { BasicTarget } from './utils/domTarget';

/** * 是否为mac系统（包含iphone手机） * */
export function isMac() {
  const info = detect();
  return info?.os === 'Mac OS' || info?.os === 'darwin';
}

export function toHotkeyStr(event: React.KeyboardEvent | KeyboardEvent) {
  const { metaKey, ctrlKey, altKey, shiftKey, key } = event;
  if (key === 'Command' || key === 'Control' || key === 'Meta' || key === 'Shift' || key === 'Alt') return '';
  const keyArr: string[] = [];
  if (isMac()) {
    if (metaKey) {
      keyArr.push('Command');
    }
    if (ctrlKey) {
      keyArr.push('Ctrl');
    }
    if (shiftKey) {
      keyArr.push('Shift');
    }
    if (altKey) {
      keyArr.push('Alt');
    }
    if (key.length === 1) {
      keyArr.push(key.toUpperCase());
    } else {
      keyArr.push(key);
    }
  } else {
    if (ctrlKey) {
      keyArr.push('Ctrl');
    }
    if (shiftKey) {
      keyArr.push('Shift');
    }
    if (altKey) {
      keyArr.push('Alt');
    }
    if (metaKey) {
      keyArr.push('Meta');
    }
    if (key.length === 1) {
      keyArr.push(key.toUpperCase());
    } else {
      keyArr.push(key);
    }
  }
  return keyArr.join('+');
}

// 功能键权重
const fnKeyOrder = {
  Command: -10,
  Ctrl: -8,
  Shift: -6,
  Alt: -4,
  Meta: -2,
};

// 将 hotkey 标准化
export function normalizeHotkeyStr(hotkeyStr: string) {
  const keyArr = hotkeyStr.trim().split('+');
  return (
    keyArr
      .map(key => key.trim())
      // 按功能键权重排序
      .sort((key1, key2) => (fnKeyOrder[key1] || 0) - (fnKeyOrder[key2] || 0))
      .join('+')
  );
}

export function divOnlyFilter(e: KeyboardEvent) {
  if (e.target?.['tagName'] === 'DIV') {
    return true;
  }
  return false;
}

export type HotkeyEventType = string;

export type UseHotkeyListenerOptions = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  target?: BasicTarget<HTMLElement | Element | Window | Document>;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  filter?: (e: KeyboardEvent) => boolean | void;
  // 是否监听所有元素，默认不监听 INPUT、TEXTAREA、BUTTON 等
  allElement?: boolean;
  // 自动转换 Mac 下的快捷键
  // autoMacCommand?: boolean;
};

export default function useCombineKeyListener(combineKey: HotkeyEventType, callback: (ev: KeyboardEvent) => void, options: UseHotkeyListenerOptions = {}) {
  const { stopPropagation = false, preventDefault = false, filter, allElement = false } = options;

  // 支持逗号分隔
  const hotkeyStrArr = useMemo(() => combineKey.split(',').map(normalizeHotkeyStr), [combineKey]);

  useEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const hotkeyStr = toHotkeyStr(e);
      if (!hotkeyStr) return;
      // 判断是否匹配 hotkey
      if (!hotkeyStrArr.includes(hotkeyStr)) {
        return;
      }
      // 过滤
      if (typeof filter === 'function') {
        if (filter(e) === false) {
          return;
        }
      } else if (!allElement) {
        // 没有设置 filter，自动判断，排除不监听的内容
        if (['INPUT', 'TEXTAREA', 'BUTTON'].includes((e.target as HTMLElement).tagName)) {
          return;
        }
      }
      if (stopPropagation) {
        e.stopPropagation();
      }
      if (preventDefault) {
        e.preventDefault();
      }
      callback(e);
    },
    {
      target: options.target,
    },
  );
}
