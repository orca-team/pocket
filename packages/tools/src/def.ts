export type Nullable<T> = T | null;

export type RevMapOptions<T> = {
  /** 子节点的 key */
  childKey?: string;

  /** 是否优先遍历子节点 */
  childFirst?: boolean;

  replaceChildren?: boolean;
  parent?: T;
};
