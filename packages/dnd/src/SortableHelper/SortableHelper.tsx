import type { ComponentClass, FunctionComponent, HTMLAttributes, ReactHTML, ReactNode } from 'react';
import React, { createElement, useContext, useMemo, useState } from 'react';
import type { DndContextProps, DragOverlayProps } from '@dnd-kit/core';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useControllableValue } from 'ahooks';
import cn from 'classnames';
import type { SortableContextProps } from '@dnd-kit/sortable';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { SortableHelperContext } from '../context';
import KeyManager from '../KeyManager';
import { SortableItemContext } from '../utils/SortHandle';
import useStyles from './SortableHelper.style';

const eArr = [];

const ef = () => undefined;

export const SortableHelperDragSort = (
  props: Omit<DragOverlayProps, 'children'> & {
    children: (data: any, index: number) => ReactNode;
  },
) => {
  const { children = () => null, ...otherProps } = props;
  const { activeItem, activeIndex } = useContext(SortableHelperContext);
  return <DragOverlay {...otherProps}>{children(activeItem, activeIndex)}</DragOverlay>;
};

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
    keyManager: _keyManager,
    strategy,
    disabled,
    ...otherProps
  } = props;

  const [data = eArr, setData] = useControllableValue<T[]>(props, {
    trigger: 'onChange',
    defaultValuePropName: 'defaultData',
    valuePropName: 'data',
  });

  const [activeIndexPath, setActiveIndexPath] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const activeItem = data[activeIndex];

  const sensors = useSensors(
    useSensor(PointerSensor),
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // }),
  );

  // 通过映射的方式，实现无需传递 key 也可实现排序
  const [keyManager] = useState(() => {
    if (typeof _keyManager === 'string') return new KeyManager<T>(_keyManager);
    return _keyManager ?? new KeyManager<T>();
  });

  // 最外层的 keys
  const rootKeys = useMemo(() => keyManager.getKeys(data), [data]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = rootKeys.indexOf(active.id);
      const newIndex = rootKeys.indexOf(over.id);

      setData(data => arrayMove(data, oldIndex, newIndex), oldIndex, newIndex, data);
    }
    setActiveIndex(-1);
    setActiveIndexPath([]);
  }

  return (
    <SortableHelperContext.Provider
      value={useMemo(
        () => ({
          keys: rootKeys,
          data,
          customHandle,
          activeItem,
          activeIndex,
          keyManager,
          activeIndexPath,
        }),
        [rootKeys, data, customHandle, activeItem, activeIndex, keyManager, activeIndexPath],
      )}
    >
      <DndContext
        onDragStart={(event) => {
          const index = rootKeys.indexOf(`${event.active.id}`);
          onDragStartIndex(index);
          setActiveIndex(index);
          onDragStart?.(event);

          // TODO 根据 active.id 查找拖拽的深度
          setActiveIndexPath([]);
        }}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        sensors={sensors}
        {...otherProps}
      >
        <SortableContext items={rootKeys} strategy={strategy} disabled={disabled}>
          {children}
        </SortableContext>
      </DndContext>
    </SortableHelperContext.Provider>
  );
};

export default SortableHelper;
