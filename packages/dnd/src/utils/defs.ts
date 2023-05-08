// 描述可排序列表的 children 类型，支持传递普通的 ReactNode 或者传递一个函数，函数的参数为 item 和 index，返回值为 ReactNode
import type { useSortable } from '@dnd-kit/sortable';
import type { ReactNode } from 'react';

export type SortableItemChildren<T> = ReactNode | ((item: T, index: number, args?: ReturnType<typeof useSortable>) => ReactNode);
