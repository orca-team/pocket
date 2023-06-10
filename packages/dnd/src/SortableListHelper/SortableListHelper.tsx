import React from 'react';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { SortableHelperProps } from '../SortableHelper';
import SortableHelper, { SortableHelperItem } from '../SortableHelper';

export const SortableListHelperItem = SortableHelperItem;

export type SortableListHelperProps<T extends Object> = SortableHelperProps<T>;

/**
 * 可排序列表組件（組件和 Item 分離）
 */
const SortableListHelper = <T extends Object>(props: SortableListHelperProps<T>) => {
  const { strategy = verticalListSortingStrategy, ...otherProps } = props;
  return <SortableHelper strategy={strategy} {...otherProps} />;
};

export default SortableListHelper;
