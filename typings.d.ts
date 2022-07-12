declare module '*.css';
declare module '*.png' {
  const url: string;
  export default url;
}

declare module '*.less' {
  type KeyValue = Record<string, string>;
  const res: KeyValue;
  export default res;
}
