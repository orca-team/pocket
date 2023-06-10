import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import { useControllableValue } from 'ahooks';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';
import useStyles from './SortableList.style';
import { SortableItemContext } from '../utils/SortHandle';
import type { SortableItemChildren } from '../utils/defs';
import KeyManager from '../KeyManager';
import type { SortableHelperItemProps } from '../SortableHelper';
import SortableHelper, { SortableHelperDragSort, SortableHelperItem } from '../SortableHelper';

const eArr = [];

interface SortableItemProps<T> extends Omit<SortableHelperItemProps, 'children'> {
  children?: SortableItemChildren<T>;
}

/**
 * 可排序列表的子项
 */
function SortableListItem<T>(props: SortableItemProps<T>) {
  const { children = null, ...otherProps } = props;

  return (
    <SortableHelperItem {...otherProps}>
      {typeof children === 'function' ? (
        <SortableItemContext.Consumer>{({ item, sortable, row }) => children(item, row, sortable || undefined)}</SortableItemContext.Consumer>
      ) : (
        children
      )}
    </SortableHelperItem>
  );
}

/**
 * 可排序列表（本体组件）
 */
export interface SortableListProps<T extends Object> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {

  /** 默认数据（非受控） */
  defaultData?: T[];

  /** 数据（受控） */
  data?: T[];

  /** 数据变化事件 */
  onChange?: (data: T[], from: number, to: number, originData: T[]) => void;

  /** 渲染自定义子节点 */
  children?: SortableItemChildren<T>;

  /** 是否自定义拖拽按钮 */
  customHandle?: boolean;

  /** 自定义 key 管理器 */
  keyManager?: KeyManager<T> | string;
}

const SortableList = <T extends Object>(props: SortableListProps<T>) => {
  const { className = '', customHandle, children, defaultData, keyManager, data: nouse1, onChange, ...otherProps } = props;
  const styles = useStyles();
  const [data = eArr, setData] = useControllableValue<T[]>(props, {
    trigger: 'onChange',
    defaultValuePropName: 'defaultData',
    valuePropName: 'data',
  });

  // 通过映射的方式，实现无需传递 key 也可实现排序
  const [keyMgr] = useState(() => {
    if (typeof keyManager === 'string') return new KeyManager<T>(keyManager);
    return keyManager ?? new KeyManager<T>();
  });

  const keys = useMemo(() => keyMgr.getKeys(data), [data]);

  return (
    <div className={cn(styles.root, className)} {...otherProps}>
      <SortableHelper customHandle={customHandle} data={data} onChange={setData} strategy={verticalListSortingStrategy}>
        {data.map((item, index) => (
          <SortableListItem<T> key={keys[index]} row={index}>
            {children}
          </SortableListItem>
        ))}
        <SortableHelperDragSort className={cn({ [styles.handle]: !customHandle })}>
          {(activeItem, activeIndex) => activeItem != null && (typeof children === 'function' ? children(activeItem, activeIndex) : children)}
        </SortableHelperDragSort>
      </SortableHelper>
    </div>
  );
};

export default SortableList;
