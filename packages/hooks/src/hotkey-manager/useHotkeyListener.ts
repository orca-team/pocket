import { useMemoizedFn } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
import type { HotkeyActionType } from './HotkeyManagerContext';
import HotkeyManagerContext from './HotkeyManagerContext';

export default function useHotkeyListener(
  hotkeyName: HotkeyActionType['hotkeyName'],
  action: HotkeyActionType['action'],
  options: Omit<HotkeyActionType, 'hotkeyName' | 'action'> = {},
) {
  const { registerHotkeyAction, unregisterHotkeyAction } =
    useContext(HotkeyManagerContext);
  const getOptionTarget = useMemoizedFn(() => options.target?.());
  const memoAction = useMemoizedFn(action);

  const [actionObject] = useState<HotkeyActionType>({
    action: memoAction,
    hotkeyName,
    target: getOptionTarget,
  });

  actionObject.hotkeyName = hotkeyName;
  actionObject.input = options.input;
  actionObject.through = options.through;

  useEffect(() => {
    registerHotkeyAction(actionObject);
    return () => {
      unregisterHotkeyAction(actionObject);
    };
  }, []);
}
