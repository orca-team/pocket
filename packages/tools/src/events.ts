/** * 是否为mac系统（包含iphone手机） * */
export function isMac() {
  return /macintosh|mac os x/i.test(navigator.userAgent);
}

export function isSingleKey(event: KeyboardEvent) {
  const { metaKey, ctrlKey, altKey, shiftKey } = event;
  const singleKey = !ctrlKey && !shiftKey && !altKey && !metaKey;
  return singleKey;
}

export function isShiftOnly(event: KeyboardEvent) {
  const { metaKey, ctrlKey, altKey, shiftKey } = event;
  const shiftOnly = shiftKey && !ctrlKey && !altKey && !metaKey;
  return shiftOnly;
}

export function isCtrlOnly(event: KeyboardEvent) {
  const { metaKey, ctrlKey, altKey, shiftKey } = event;
  const ctrlOnly =
    !shiftKey &&
    !altKey &&
    (isMac() ? metaKey && !ctrlKey : ctrlKey && !metaKey);
  return ctrlOnly;
}

export function isCut(event: KeyboardEvent) {
  const ctrlOnly = isCtrlOnly(event);
  return ctrlOnly && event.key === 'x';
}

export function isCopy(event: KeyboardEvent) {
  const ctrlOnly = isCtrlOnly(event);
  return ctrlOnly && event.key === 'c';
}

export function isPaste(event: KeyboardEvent) {
  const ctrlOnly = isCtrlOnly(event);
  return ctrlOnly && event.key === 'v';
}

export function isDelete(event: KeyboardEvent) {
  const singleKey = isSingleKey(event);
  return (
    (singleKey && event.key === 'Delete') ||
    (event.key === 'Backspace' && isMac())
  );
}
