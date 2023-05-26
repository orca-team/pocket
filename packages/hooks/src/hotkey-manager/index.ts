import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

export default (props: PropsWithChildren) => {
  const { children } = props;
  useEffect(() => {
    console.error('Warning: HotkeyManager is deprecated. Just remove it.');
  }, []);
  return children;
};
