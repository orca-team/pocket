import type { ComponentClass, FunctionComponent, HTMLAttributes, ReactNode, ReactHTML } from 'react';
import React, { createContext, createElement, useContext, useMemo, useState } from 'react';
import type { DndContextProps } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useControllableValue } from 'ahooks';
import cn from 'classnames';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KeyManager from '../KeyManager';
import { SortableItemContext } from '../utils/SortHandle';
import useStyles from './SortableListHelper.style';

const eArr = [];

const ef = () => undefined;

type SortableListHelperContextType = {
  keys: string[];
  data: any[];
  customHandle: boolean;
};
const SortableListHelperContext = createContext<SortableListHelperContextType>({
  keys: [],
  data: [],
  customHandle: false,
});

export interface SortableListHelperItemProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  tag?: keyof ReactHTML | FunctionComponent<any> | ComponentClass<any>;
  row: number;
}

// 子項
export const SortableListHelperItem = (props: SortableListHelperItemProps) => {
  const { children, row, style, tag = 'div', className = '', ...otherProps } = props;
  const { keys, data, customHandle } = useContext(SortableListHelperContext);
  const sortable = useSortable({ id: keys[row] });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;
  const styles = useStyles();

  const mergedStyle = {
    ...style,
    '--translate-x': transform ? `${transform.x}px` : 0,
    '--translate-y': transform ? `${transform.y}px` : 0,
    '--transition': transition,
  } as React.CSSProperties;

  if (!children) return null;

  return (
    <SortableItemContext.Provider
      value={{
        sortable,
        row,
        item: data[row],
      }}
    >
      {createElement(
        tag,
        {
          className: cn(styles.item, { [styles.dragging]: isDragging, [styles.handle]: !customHandle }, className),
          ref: setNodeRef,
          style: mergedStyle,
          ...otherProps,
          ...attributes,
          ...(customHandle ? {} : listeners),
        },
        children,
      )}
    </SortableItemContext.Provider>
  );
};

export interface SortableListHelperProps<T extends Object> extends DndContextProps {

  /** 数据（受控） */
  data?: T[];

  /** 数据变化事件 */
  onChange?: (data: T[], from: number, to: number, originData: T[]) => void;

  /** 渲染自定义子节点 */
  children?: ReactNode;

  /** 是否自定义拖拽按钮 */
  customHandle?: boolean;

  /** 额外增加的一个拖拽下标事件 */
  onDragStartIndex?(index: number): void;

  /** 自定义 key 管理器 */
  keyManager?: KeyManager<T> | string;
}

/**
 * 可排序列表組件（組件和 Item 分離）
 */
const SortableListHelper = <T extends Object>(props: SortableListHelperProps<T>) => {
  const { data: nouse, onChange, children, customHandle = false, onDragStartIndex = ef, onDragStart, keyManager, ...otherProps } = props;

  const [data = eArr, setData] = useControllableValue<T[]>(props, {
    trigger: 'onChange',
    defaultValuePropName: 'defaultData',
    valuePropName: 'data',
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // }),
  );

  // 通过映射的方式，实现无需传递 key 也可实现排序
  const [keyMgr] = useState(() => {
    if (typeof keyManager === 'string') return new KeyManager<T>(keyManager);
    return keyManager ?? new KeyManager<T>();
  });

  const keys = useMemo(() => keyMgr.getKeys(data), [data]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = keys.indexOf(active.id);
      const newIndex = keys.indexOf(over.id);

      setData(data => arrayMove(data, oldIndex, newIndex), oldIndex, newIndex, data);
    }
  }

  return (
    <SortableListHelperContext.Provider value={useMemo(() => ({ keys, data, customHandle }), [keys, data, customHandle])}>
      <DndContext
        onDragStart={(event) => {
          onDragStartIndex(keys.indexOf(`${event.active.id}`));
          onDragStart?.(event);
        }}
        onDragEnd={handleDragEnd}
        {...otherProps}
        collisionDetection={closestCenter}
        sensors={sensors}
      >
        <SortableContext items={keys} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </DndContext>
    </SortableListHelperContext.Provider>
  );
};

export default SortableListHelper;
