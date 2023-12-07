import type { ReactNode } from 'react';
import React, { useMemo, useState } from 'react';
import type { DndContextProps } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { SortableContextProps } from '@dnd-kit/sortable';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useControllableValue } from 'ahooks';
import KeyManager from '../KeyManager';

const eArr = [];

export interface MultiSortableHelperProps<T extends Object> extends DndContextProps, Pick<SortableContextProps, 'strategy' | 'disabled'> {

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

  disabledRootSortable?: boolean;
}

function MultiSortableHelper<T extends Object>(props: MultiSortableHelperProps<T>) {
  const { data: nouse, onChange, strategy, disabledRootSortable, children, ...otherProps } = props;

  const [data = eArr, setData] = useControllableValue<T[]>(props, {
    trigger: 'onChange',
    defaultValuePropName: 'defaultData',
    valuePropName: 'data',
  });

  // 通过映射的方式，实现无需传递 key 也可实现排序
  const [keyMgr] = useState(() => new KeyManager<T>());
  const rootKeys = useMemo(() => keyMgr.getKeys(data), [data]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = rootKeys.indexOf(active.id);
      const newIndex = rootKeys.indexOf(over.id);

      setData(data => arrayMove(data, oldIndex, newIndex), oldIndex, newIndex, data);
    }
  }

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      onDragStart={(event) => {
        // const index = keys.indexOf(`${event.active.id}`);
        // onDragStartIndex(index);
        // setActiveIndex(index);
        // onDragStart?.(event);
      }}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      sensors={sensors}
      {...otherProps}
    >
      <SortableContext items={rootKeys} strategy={strategy} disabled={disabledRootSortable}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export default MultiSortableHelper;
