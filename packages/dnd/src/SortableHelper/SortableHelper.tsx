import type { ComponentClass, FunctionComponent, HTMLAttributes, ReactElement, ReactHTML, ReactNode } from 'react';
import React, { createElement, useContext, useMemo, useState } from 'react';
import type { DndContextProps, DragOverlayProps } from '@dnd-kit/core';
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useControllableValue } from 'ahooks';
import cn from 'classnames';
import type { SortableContextProps } from '@dnd-kit/sortable';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { useGetState, useMemorizedFn } from '@orca-fe/hooks';
import { SortableHelperContext } from '../context';
import KeyManager from '../KeyManager';
import { SortableItemContext } from '../utils/SortHandle';
import useStyles from './SortableHelper.style';
import { treeMove } from './utils';

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
  const sortable = useSortable({
    id: keys[row],
    data: {
      originalData: data[row],
    },
  });
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

export type SubSortableProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  row: number;
  tag?: keyof ReactHTML | FunctionComponent<any> | ComponentClass<any>;
  children?: (item: any, index: number[]) => ReactElement;
  strategy?: SortableContextProps['strategy'];
};

// 多层子列表
export const SubSortable = (props: SubSortableProps) => {
  const { children, strategy, tag = 'div', row, ...otherProps } = props;

  const context = useContext(SortableHelperContext);
  const { data, keyManager, getChildren } = context;

  const childrenData = useMemo(() => getChildren(data[row]), [data[row]]);
  const childrenKeys = useMemo(() => keyManager.getKeys(childrenData), [childrenData]);

  return (
    <SortableHelperContext.Provider
      value={useMemo(
        () => ({
          ...context,
          keys: childrenKeys,
          data: childrenData,
        }),
        [context, childrenKeys, childrenData],
      )}
    >
      <SortableContext items={childrenKeys} strategy={strategy} disabled={false}>
        {createElement(
          tag,
          otherProps,
          childrenData.map((item, index) => {
            const key = keyManager.getKey(item);
            const element = children?.(item, [row, index]);
            if (!element) return null;
            return (
              <SortableHelperItem key={key} row={index}>
                {element}
              </SortableHelperItem>
            );
          }),
        )}
      </SortableContext>
    </SortableHelperContext.Provider>
  );
};

const defaultGetMultipleChildren = (item: any) => item ?? [];

export type MultipleConfig<T> = {
  getChildren?: (item: T) => any[];
  disabled?: boolean;
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

  /** 多层子列表拖拽 */
  multiple?: MultipleConfig<T>;
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
    multiple = { disabled: true },
    ...otherProps
  } = props;

  const { disabled: disabledChildren = false, getChildren: _getChildren = defaultGetMultipleChildren } = multiple;
  const getChildren = useMemorizedFn(_getChildren);

  const [_data = eArr, setData] = useControllableValue<T[]>(props, {
    trigger: 'onChange',
    defaultValuePropName: 'defaultData',
    valuePropName: 'data',
  });

  // 临时数据，用于临时记录拖拽过程中的数据
  const [tmpData, setTmpData] = useGetState<
    | {
        data: T[];
        // 记录当前被拖拽的元素的路径
        path: number[];
      }
    | undefined
  >(undefined);
  const data = tmpData?.data || _data;

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
  const rootKeys = useMemo(() => keyManager.getKeys(data, (_, index) => ({ depth: 0, path: [index] })), [data]);

  // 更新子层的 keys
  useMemo(() => {
    if (disabledChildren) return [];
    return data.map((item, index1) => {
      const children = getChildren(item);
      if (!children) return undefined;

      return keyManager.getKeys(children, (_, index2) => ({ depth: 1, path: [index1, index2] }));
    });
  }, [data]);

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
          getChildren,
        }),
        [rootKeys, data, customHandle, activeItem, activeIndex, keyManager, activeIndexPath],
      )}
    >
      <DndContext
        onDragStart={(event) => {
          const { active } = event;
          const { originalData } = active.data.current || {};
          const extraInfo = keyManager.getExtraInfo(originalData);
          const index = rootKeys.indexOf(`${event.active.id}`);
          onDragStartIndex(index);
          setActiveIndex(index);
          onDragStart?.(event);
          setActiveIndexPath(extraInfo?.path ?? []);
          // 如果拖拽的是子列表中的内容，则使用 tmpData 记录临时数据
          if (extraInfo?.path?.length > 1) {
            setTmpData({
              data: data.slice(),
              path: extraInfo.path,
            });
          }
        }}
        onDragOver={(event) => {
          const { over } = event;
          if (!over) return;
          const { originalData } = over.data.current || {};
          const extraInfo = keyManager.getExtraInfo(originalData);
          const newPath = extraInfo?.path ?? [];
          if (newPath.length > 1) {
            setTmpData((o) => {
              if (!o) return undefined;
              const { data, path: oldPath } = o;
              if (newPath.join(',') === oldPath.join(',')) return { data, path: oldPath };
              const { tree: newData, toPath: finalPath } = treeMove(data, oldPath, newPath, getChildren);
              return {
                data: newData,
                path: finalPath,
              };
            });
          }
          // setActiveIndexPath(extraInfo?.path ?? []);
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

SortableHelper.Item = SortableHelperItem;

SortableHelper.DragSort = SortableHelperDragSort;

SortableHelper.SubSortable = SubSortable;

export default SortableHelper;
