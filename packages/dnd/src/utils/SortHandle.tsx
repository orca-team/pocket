// 传递 useSortable 到子组件，例如下面实现的 SortHandle
import type { ReactElement } from 'react';
import { cloneElement, createContext, useContext } from 'react';
import type { useSortable } from '@dnd-kit/sortable';

export const SortableItemContext = createContext<{
  sortable: ReturnType<typeof useSortable> | null;
  item: any;
  row: number;
}>({
  sortable: null,
  item: null,
  row: -1,
});

/**
 * 自定义排序 Handle
 * 自动将 sortable 的 listeners(onPointerDown) 传递给 children
 */
export const SortHandle = (props: { children?: ReactElement }) => {
  const { children } = props;
  const { sortable } = useContext(SortableItemContext);
  if (!children) return null;
  // eslint-disable-next-line react/destructuring-assignment
  return sortable ? cloneElement(children, sortable.listeners) : children;
};

export default SortHandle;
