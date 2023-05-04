import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useControllableValue } from 'ahooks';
import KeyManager from '../KeyManager';
import useStyles from './SortableList.style';

const eArr = [];

// 传递 useSortable 到子组件，例如下面实现的 SortHandle
export const SortableItemContext = React.createContext<ReturnType<typeof useSortable> | null>(null);

/**
 * 自定义排序 Handle
 * 自动将 sortable 的 listeners(onPointerDown) 传递给 children
 */
export const SortHandle = (props: { children?: React.ReactElement }) => {
  const { children } = props;
  const sortable = React.useContext(SortableItemContext);
  if (!children) return null;
  return sortable ? React.cloneElement(children, sortable.listeners) : children;
};

// 描述可排序列表的 children 类型，支持传递普通的 ReactNode 或者传递一个函数，函数的参数为 item 和 index，返回值为 ReactNode
type SortableItemChildren<T> = React.ReactNode | ((item: T, index: number, args?: ReturnType<typeof useSortable>) => React.ReactNode);

type SortableItemProps<T> = {
  id: UniqueIdentifier;
  item: T;
  customHandle?: boolean;
  index?: number;
  children?: SortableItemChildren<T>;
};

/**
 * 可排序列表的子项
 */
function SortableItem<T>(props: SortableItemProps<T>) {
  const { id, item, index = -1, customHandle, children = null } = props;
  const styles = useStyles();
  const sortable = useSortable({ id });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;

  const style = {
    '--translate-x': transform ? `${transform.x}px` : 0,
    '--translate-y': transform ? `${transform.y}px` : 0,
    '--transition': transition,
  } as React.CSSProperties;

  return (
    <SortableItemContext.Provider value={sortable}>
      <div
        className={cn(styles.item, { [styles.dragging]: isDragging, [styles.handle]: !customHandle })}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...(customHandle ? {} : listeners)}
      >
        {typeof children === 'function' ? children(item, index, sortable) : children}
      </div>
    </SortableItemContext.Provider>
  );
}

/**
 * 可排序列表（本体组件）
 */
export interface SortableListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {

  /** 默认数据（非受控） */
  defaultData?: T[];

  /** 数据（受控） */
  data?: T[];

  /** 数据变化事件 */
  onChange?: (data: T[], from: number, to: number, originData: T[]) => void;

  /** 渲染自定义子节点 */
  children?: SortableItemProps<T>['children'];

  /** 是否自定义拖拽按钮 */
  customHandle?: boolean;
}

const SortableList = <T extends Object>(props: SortableListProps<T>) => {
  const { className = '', customHandle, children, defaultData, data: nouse1, onChange, ...otherProps } = props;
  const styles = useStyles();
  const [data = eArr, setData] = useControllableValue<T[]>(props, {
    trigger: 'onChange',
    defaultValuePropName: 'defaultData',
    valuePropName: 'data',
  });
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const activeItem = data[activeIndex];
  const sensors = useSensors(
    useSensor(PointerSensor),
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // }),
  );

  // 通过映射的方式，实现无需传递 key 也可实现排序
  const [keyMgr] = useState(() => new KeyManager());

  const keys = useMemo(() => keyMgr.getKeys(data), [data]);

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveIndex(-1);
    if (active.id !== over.id) {
      const oldIndex = keys.indexOf(active.id);
      const newIndex = keys.indexOf(over.id);

      setData(data => arrayMove(data, oldIndex, newIndex), oldIndex, newIndex, data);
    }
  }

  return (
    <div className={cn(styles.root, className)} {...otherProps}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => {
          setActiveIndex(keys.indexOf(`${active.id}`));
        }}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={keys} strategy={verticalListSortingStrategy}>
          {data.map((item, index) => (
            <SortableItem<T> key={keys[index]} id={keys[index]} item={item} index={index} customHandle={customHandle}>
              {children}
            </SortableItem>
          ))}
        </SortableContext>
        <DragOverlay className={cn({ [styles.handle]: !customHandle })}>
          {activeItem != null && (typeof children === 'function' ? children(activeItem, activeIndex) : children)}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SortableList;
