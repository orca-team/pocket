import React from 'react';

/** * 是否为mac系统（包含iphone手机） * */
export function isMac() {
  return /macintosh|mac os x/i.test(navigator.userAgent);
}

export function isCtrlOnly(event: React.KeyboardEvent | KeyboardEvent) {
  const { metaKey, ctrlKey, altKey, shiftKey } = event;
  const ctrlOnly =
    !shiftKey &&
    !altKey &&
    (isMac() ? metaKey && !ctrlKey : ctrlKey && !metaKey);
  return ctrlOnly;
}

export function isCopy(event: React.KeyboardEvent | KeyboardEvent) {
  const ctrlOnly = isCtrlOnly(event);
  return ctrlOnly && event.key === 'c';
}

export function isPaste(event: React.KeyboardEvent | KeyboardEvent) {
  const ctrlOnly = isCtrlOnly(event);
  return ctrlOnly && event.key === 'v';
}
