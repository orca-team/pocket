import type { PropsWithChildren } from 'react';
import React, { isValidElement, useEffect } from 'react';

export default (props: PropsWithChildren) => {
  const { children } = props;
  useEffect(() => {
    console.error('Warning: HotkeyManager is deprecated. Just remove it.');
  }, []);

  if (isValidElement(children)) return children;

  return <>{children}</>;
};
