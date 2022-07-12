import React, { useMemo, useRef, useState } from 'react';
import pc from 'prefix-classnames';
import { useClickAway, useEventListener } from 'ahooks';
import ReactDOM from 'react-dom';
import {
  arr2Keys,
  changeArr,
  isCopy,
  isPaste,
  removeArrIndex,
  toggleArr,
} from '@orca-fe/tools';

const px = pc('draggable-list');

const eArr = [];

const ef = () => {};

/**
 * 从鼠标事件中，获取当前鼠标相对于当前元素的位置信息
 */
function getMousePosition(event: React.MouseEvent<HTMLDivElement>) {
  const { currentTarget, clientY, clientX } = event;
  if (currentTarget instanceof HTMLElement) {
    const { top, left, width, height } = currentTarget.getBoundingClientRect();
    return {
      x: clientX - left,
      y: clientY - top,
      xPercent: (clientX - left) / width,
      yPercent: (clientY - top) / height,
    };
  }
  return undefined;
}

const DraggingNum = (props) => {
  const { value } = props;

  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

  useEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;
    setMouse({
      x: clientX,
      y: clientY,
    });
  });

  return ReactDOM.createPortal(
    <div className={px('dragging-num')} style={{ top: mouse.y, left: mouse.x }}>
      {value}
    </div>,
    document.body,
  );
};

type DraggableData = {
  key?: string | number;
};

export interface DraggableListProps<T extends DraggableData>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  // 列表数据
  data?: T[];
  // 列表数据发生变化
  onDataChange?: (data: T[]) => void;
  // 渲染回调
  children: (
    item: T,
    params: {
      checked: boolean;
      dragging: boolean;
      changeItem: (item: Partial<T>) => void;
      removeItem: () => void;
      drag: () => void;
      moveUp: () => boolean;
      moveDown: () => boolean;
    },
    index: number,
  ) => React.ReactChild;
  // 使用自定义样式
  customStyle?: boolean;

  // 是否支持快捷键复制粘贴
  copyByKeyboard?: boolean;

  onGenerateKey?: (data: T) => T;

  checkMode?: boolean;

  // 自定义拖拽内容
  customDragHandler?: boolean;
}

let index = 0;

const defaultHandleGenerateKey = <T extends DraggableData>(item: T): T => ({
  ...item,
  key: `tmp_${index++}_${Math.trunc(Math.random() * 1000000)}`,
});

const DraggableList = <T extends DraggableData>(
  props: DraggableListProps<T>,
) => {
  const {
    className = '',
    data = eArr,
    onDataChange = ef,
    children,
    customStyle,
    checkMode = true,
    onGenerateKey = defaultHandleGenerateKey,
    customDragHandler = false,
    ...otherProps
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  const [_this] = useState(() => ({
    mouseDownTargetTagName: '',
    lastChangeTime: 0,
  }));

  // 已复制的记录
  const [copyItem, setCopyItem] = useState<(string | number)[]>([]);
  // 正在拖拽的记录
  const [draggingItem, setDraggingItem] = useState<(string | number)[]>([]);
  // 已选中的记录
  const [checked, _setChecked] = useState<(string | number)[]>([]);

  const setChecked: typeof _setChecked = (c) => {
    if (checkMode) {
      _setChecked(c);
    } else {
      _setChecked(eArr);
    }
  };

  const dragging = draggingItem.length > 0;

  const [insertFlag, setInsertFlag] = useState(-2);

  const getByKey = useMemo<(key: string | number) => T>(() => {
    const cache: Record<string | number, T> = {};
    data.forEach((item) => {
      if (item.key) cache[item.key] = item;
    });
    return (_k) => cache[_k];
  }, [data]);

  const isChecked = useMemo<(key?: string | number) => boolean>(() => {
    const cache = {};
    checked.forEach((key) => {
      cache[key] = 1;
    });
    return (_k) => (_k != null ? !!cache[_k] : false);
  }, [checked]);

  const isDragging = useMemo<(key?: string | number) => boolean>(() => {
    const cache = {};
    draggingItem.forEach((key) => {
      cache[key] = 1;
    });
    return (_k) => (_k != null ? !!cache[_k] : false);
  }, [draggingItem]);

  // 点击其它地方后，取消选中
  useClickAway((event) => {
    const { ctrlKey, shiftKey } = event as MouseEvent;
    if (ctrlKey || shiftKey) {
      return;
    }
    // 拖拽到容器外部时，pointerup 事件会与 Click 重复，临时使用一个 debounce 方案解决。
    if (Date.now() - _this.lastChangeTime < 50) {
      return;
    }
    if (checked.length > 0) {
      setChecked([]);
    }
  }, rootRef);

  const cancelDrag = () => {
    setInsertFlag(-2);
    setDraggingItem([]);
  };

  // 右键取消拖拽
  useEventListener('mousedown', (e) => {
    if (e.button === 2 && dragging) {
      e.preventDefault();
      cancelDrag();
    }
  });

  // 右键取消拖拽
  useEventListener('contextmenu', (e) => {
    if (e.button === 2 && dragging) {
      e.preventDefault();
      cancelDrag();
    }
  });

  // 监听全局鼠标抬起事件，用于进行列表数据移动
  useEventListener('pointerup', (e) => {
    if (e.button === 0 && dragging) {
      // 释放，移动列表数据
      // 根据 insertFlag 查找释放的位置
      let startKey: string | number | undefined;
      for (let i = insertFlag; i >= 0; i -= 1) {
        if (!isDragging(data[i].key)) {
          startKey = data[i].key;
          break;
        }
      }
      const tmp: T[] = [];
      const newData = data.filter((item) => {
        if (isDragging(item.key)) {
          tmp.push(item);
          return false;
        }
        return true;
      });
      const startIndex = newData.findIndex(({ key }) => key === startKey);
      newData.splice(startIndex + 1, 0, ...tmp);
      onDataChange(newData);
      cancelDrag();
      _this.lastChangeTime = Date.now();
    }
  });

  const moveSingle = (from: number, to: number) => {
    if (to < 0 || to > data.length) {
      return false;
    }
    const fromItem = data[from];
    const placeholder = {} as T;
    const newData = data.slice();
    newData.splice(to, 0, placeholder);
    // 替换内容
    onDataChange(
      newData
        .filter((item) => item !== fromItem)
        .map((item) => (item === placeholder ? fromItem : item)),
    );
    return true;
  };

  return (
    <div
      ref={rootRef}
      className={`${px('root', {
        dragging,
        'internal-style': !customStyle,
      })} ${className}`}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (
          isCopy(e.nativeEvent) &&
          (e.target['tagName'] === 'DIV' || checked.length > 1)
        ) {
          e.stopPropagation();
          const keys = arr2Keys(data);
          if (checked.filter((key) => keys.has(key)).length > 0) {
            setCopyItem(checked);
            // Toast.infoTop(`${checked.length} 项已复制`);
          }
        }
        if (isPaste(e.nativeEvent) && e.target['tagName'] === 'DIV') {
          e.stopPropagation();
          // 粘贴
          if (copyItem.length > 0) {
            let pasteIndex =
              data.findIndex(({ key }) => key === checked[checked.length - 1]) +
              1;
            if (pasteIndex <= 0) {
              pasteIndex = data.length;
            }
            // 粘贴数据
            const newCopyData = copyItem.map(getByKey).map(onGenerateKey);
            const newData = data.slice();
            newData.splice(pasteIndex, 0, ...newCopyData);
            onDataChange(newData);
            setChecked(
              newCopyData
                .map(({ key }) => key)
                .filter((key) => key != null) as (string | number)[],
            );
          }
        }
      }}
      {...otherProps}
    >
      {data.map((item, index) => {
        const currentChecked = isChecked(item.key);
        const currentDragging = isDragging(item.key);
        const changeItem = (changedItem: Partial<T>) => {
          onDataChange(
            changeArr(data, index, {
              ...item,
              ...changedItem,
            }),
          );
        };
        const moveUp = () => moveSingle(index, index - 1);
        const moveDown = () => moveSingle(index, index + 2);
        const removeItem = () => {
          onDataChange(removeArrIndex(data, index));
        };

        const dragItem = () => {
          if (currentChecked) {
            // 如果当前元素是已选择的，则拖拽所选元素
            setDraggingItem(checked);
          } else if (item.key != null) {
            // 拖拽了一个未选择元素，则单独选中该元素
            setChecked([item.key]);
            setDraggingItem([item.key]);
          }
        };

        return (
          <div
            className={px('item', {
              checked: currentChecked,
              'dragging-item': currentDragging,
              before: index === insertFlag + 1,
              after: index === insertFlag,
            })}
            key={item.key}
            draggable={!customDragHandler}
            onMouseDown={(e) => {
              _this.mouseDownTargetTagName = e.target['tagName'];
            }}
            onDragStart={(e) => {
              e.preventDefault();
              if (_this.mouseDownTargetTagName === 'INPUT') {
                return;
              }
              dragItem();
            }}
            onClick={(e) => {
              // TODO 优化拖拽后的 Click 事件响应
              if (dragging) return;
              // 列表项点击事件
              const { shiftKey, ctrlKey } = e;
              if (shiftKey) {
                // 连续选择模式
                let index1 = data.findIndex(
                  (value) => value.key === checked[0],
                );
                if (index1 < 0) index1 = 0;
                const start = Math.min(index, index1);
                const end = Math.max(index, index1) + 1;
                setChecked([
                  ...checked.slice(0, 1),
                  ...(data
                    .slice(start, end)
                    .map(({ key }) => key)
                    .filter((key) => key != null && key !== checked[0]) as (
                    | string
                    | number
                  )[]),
                ]);
              } else if (ctrlKey) {
                // toggle模式
                setChecked(
                  toggleArr(checked, item.key).filter((key) => key != null) as (
                    | string
                    | number
                  )[],
                );
              } else if (item.key != null) {
                // 单选模式
                setChecked([item.key]);
              }
            }}
            onMouseMove={(e) => {
              if (dragging) {
                // 拖拽过程中，检查鼠标所在位置
                const mousePosition = getMousePosition(e);
                if (mousePosition) {
                  const { yPercent } = mousePosition;
                  const insertIndex = yPercent < 0.5 ? index - 1 : index;
                  if (insertFlag !== insertIndex) {
                    setInsertFlag(insertIndex);
                  }
                }
              }
            }}
          >
            {children(
              item,
              {
                checked: currentChecked,
                dragging: currentDragging,
                changeItem,
                removeItem,
                moveUp,
                moveDown,
                drag: dragItem,
              },
              index,
            )}
          </div>
        );
      })}
      {/* 拖拽过程中的提示 */}
      {dragging && <DraggingNum value={draggingItem.length} />}
    </div>
  );
};

export default DraggableList;
