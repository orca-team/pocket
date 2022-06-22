export function catcher<T>(
  callback: () => T,
  defaultValue: T extends Promise<infer R> ? R : T,
): T {
  try {
    const result = callback();
    if (result instanceof Promise) {
      return result.catch(() => defaultValue) as unknown as T;
    }
    return result;
  } catch (error) {}
  return defaultValue as T;
}
