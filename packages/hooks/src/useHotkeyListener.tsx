// deprecated
import { useEventListener, useSetState } from 'ahooks';
import React, { useContext, useMemo } from 'react';
import { detect } from 'detect-browser';

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
  delete: ['Delete', ['Delete', 'Backspace']],
};

function smartForEach<T>(
  arr: T | T[],
  callback: (item: T, index: number) => void,
) {
  if (Array.isArray(arr)) {
    arr.forEach(callback);
  } else {
    callback(arr, 0);
  }
}

/**
 * 生成热键缓存
 */
function createHotkeyCache(hotkey: HotkeyDefsType) {
  const hotkeyMapping = new Map<string, string>();
  const macHotkeyMapping = new Map<string, string>();
  Object.entries(hotkey).forEach(([hotkeyName, commands]) => {
    const [winKeys, macKeys] = commands;
    smartForEach(winKeys, (hotKey) => {
      if (hotkeyMapping.has(hotKey)) {
        console.warn(
          `Duplicate hot-key '${hotKey}' for command [${hotkeyName}]`,
        );
      } else {
        hotkeyMapping.set(hotKey, hotkeyName);
      }
      if (!macKeys) {
        if (macHotkeyMapping.has(hotKey)) {
          console.warn(
            `Duplicate hot-key '${hotKey}' for command(Mac) [${hotkeyName}]`,
          );
        } else {
          macHotkeyMapping.set(hotKey, hotkeyName);
        }
      }
    });
    // MacMode
    if (macKeys) {
      smartForEach(macKeys, (hotKey) => {
        if (macHotkeyMapping.has(hotKey)) {
          console.warn(
            `Duplicate hot-key '${hotKey}' for command(Mac) [${hotkeyName}]`,
          );
        } else {
          macHotkeyMapping.set(hotKey, hotkeyName);
        }
      });
    }
  });
  return { hotkeyMapping, macHotkeyMapping };
}

type HotkeyContextType = {
  hotkey: HotkeyDefsType;
  updateHotkey: (hk: HotkeyDefsType) => void;
  hotkeyMapping: Map<string, string>;
  macHotkeyMapping: Map<string, string>;
};

/* Context */
export const HotkeyContext = React.createContext<HotkeyContextType>({
  hotkey: defaultHotkeyDef,
  updateHotkey: () => {},
  ...createHotkeyCache(defaultHotkeyDef),
});

export const HotkeyProvider = (props: {
  defaultHotkeys?: HotkeyDefsType;
  children?: React.ReactNode;
}) => {
  const { defaultHotkeys = defaultHotkeyDef, children } = props;
  const [hotkey, setHotkey] = useSetState(defaultHotkeys);

  const { hotkeyMapping, macHotkeyMapping } = useMemo(
    () => createHotkeyCache(hotkey),
    [hotkey],
  );

  return (
    <HotkeyContext.Provider
      value={{
        hotkeyMapping,
        macHotkeyMapping,
        hotkey,
        updateHotkey: setHotkey,
      }}
    >
      {children}
    </HotkeyContext.Provider>
  );
};

/** * 是否为mac系统（包含iphone手机） * */
export function isMac() {
  const info = detect();
  return info?.os === 'Mac OS' || info?.os === 'darwin';
}

type HotkeyDefType = string | string[];
export type HotkeyDefsType = Record<
  string,
  [HotkeyDefType] | [HotkeyDefType, HotkeyDefType]
>;

export function toHotkeyStr(event: React.KeyboardEvent | KeyboardEvent) {
  const { metaKey, ctrlKey, altKey, shiftKey, key } = event;
  if (
    key === 'Command' ||
    key === 'Control' ||
    key === 'Meta' ||
    key === 'Shift' ||
    key === 'Alt'
  )
    return '';
  const keyArr: string[] = [];
  if (isMac()) {
    if (metaKey) {
      keyArr.push('Command');
    }
    if (shiftKey) {
      keyArr.push('Shift');
    }
    if (ctrlKey) {
      keyArr.push('Ctrl');
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
    if (key.length === 1) {
      keyArr.push(key.toUpperCase());
    } else {
      keyArr.push(key);
    }
  }
  return keyArr.join('+');
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
  target?: React.RefObject<HTMLElement>;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  filter?: (e: KeyboardEvent) => boolean | void;
};

export default function useHotkeyListener(
  hotKeyName: HotkeyEventType,
  callback: (ev: KeyboardEvent) => void,
  options: UseHotkeyListenerOptions = {},
) {
  const {
    stopPropagation = false,
    preventDefault = false,
    filter = divOnlyFilter,
  } = options;

  const { hotkeyMapping, macHotkeyMapping } = useContext(HotkeyContext);
  useEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const hotkeyStr = toHotkeyStr(e);
      if (!hotkeyStr) return;
      if (filter(e) === false) {
        return;
      }
      if (isMac()) {
        const name = macHotkeyMapping.get(hotkeyStr);
        if (name && hotKeyName === name) {
          if (stopPropagation) {
            e.stopPropagation();
          }
          if (preventDefault) {
            e.preventDefault();
          }
          callback(e);
        }
      } else {
        const name = hotkeyMapping.get(hotkeyStr);
        if (name && hotKeyName === name) {
          if (stopPropagation) {
            e.stopPropagation();
          }
          if (preventDefault) {
            e.preventDefault();
          }
          callback(e);
        }
      }
    },
    {
      target: options.target,
    },
  );
}
