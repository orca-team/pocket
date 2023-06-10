import type { ComponentClass, FunctionComponent, HTMLAttributes, ReactHTML, ReactNode } from 'react';
import React, { createContext, createElement, useContext, useMemo, useState } from 'react';
import type { DndContextProps, DragOverlayProps } from '@dnd-kit/core';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useControllableValue } from 'ahooks';
import cn from 'classnames';
import type { SortableContextProps } from '@dnd-kit/sortable';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import KeyManager from '../KeyManager';
import { SortableItemContext } from '../utils/SortHandle';
import useStyles from './SortableHelper.style';

const eArr = [];

const ef = () => undefined;

type DragOverlayContextType = {
  item: any;
  index: number;
};

const DragOverlayContext = React.createContext<DragOverlayContextType>({
  item: undefined,
  index: -1,
});

export const SortableHelperDragSort = (
  props: Omit<DragOverlayProps, 'children'> & {
    children: (data: any, index: number) => ReactNode;
  },
) => {
  const { children = () => null, ...otherProps } = props;
  const { item, index } = useContext(DragOverlayContext);
  return <DragOverlay {...otherProps}>{children(item, index)}</DragOverlay>;
};

type SortableHelperContextType = {
  keys: string[];
  data: any[];
  customHandle: boolean;
};
const SortableHelperContext = createContext<SortableHelperContextType>({
  keys: [],
  data: [],
  customHandle: false,
});

export interface SortableHelperItemProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  tag?: keyof ReactHTML | FunctionComponent<any> | ComponentClass<any>;
  row: number;
}

// 子項
export const SortableHelperItem = (props: SortableHelperItemProps) => {
  const { children, row, style, tag = 'div', className = '', ...otherProps } = props;
  const { keys, data, customHandle } = useContext(SortableHelperContext);
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
      key={keys[row]}
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

export interface SortableHelperProps<T extends Object> extends DndContextProps, Pick<SortableContextProps, 'strategy' | 'disabled'> {

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
const SortableHelper = <T extends Object>(props: SortableHelperProps<T>) => {
  const {
    data: nouse,
    onChange,
    children,
    customHandle = false,
    onDragStartIndex = ef,
    onDragStart,
    keyManager,
    strategy,
    disabled,
    ...otherProps
  } = props;

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
    <SortableHelperContext.Provider value={useMemo(() => ({ keys, data, customHandle }), [keys, data, customHandle])}>
      <DragOverlayContext.Provider value={useMemo(() => ({ item: activeItem, index: activeIndex }), [activeItem, activeIndex])}>
        <DndContext
          onDragStart={(event) => {
            const index = keys.indexOf(`${event.active.id}`);
            onDragStartIndex(index);
            setActiveIndex(index);
            onDragStart?.(event);
          }}
          onDragEnd={handleDragEnd}
          {...otherProps}
          collisionDetection={closestCenter}
          sensors={sensors}
        >
          <SortableContext items={keys} strategy={strategy} disabled={disabled}>
            {children}
          </SortableContext>
        </DndContext>
      </DragOverlayContext.Provider>
    </SortableHelperContext.Provider>
  );
};

export default SortableHelper;
