import React, { useEffect, useRef, useState } from 'react';
import pc from 'prefix-classnames';
import { useClickAway, useEventListener, useSet } from 'ahooks';
import ReactDOM from 'react-dom';
import rfdc from 'rfdc';
import { changeArr, isCopy, isPaste, removeArrIndex } from '@orca-fe/tools';

const px = pc('draggable-list-no-key');

const eArr = [];

const ef = () => {};

const deepClone = rfdc();

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

export interface DraggableListNoKeyProps<T>
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

  noHoverStyle?: boolean;

  // 是否支持快捷键复制粘贴
  copyByKeyboard?: boolean;

  checkable?: boolean;

  multipleCheck?: boolean;

  // 自定义拖拽内容
  customDragHandler?: boolean;
}

function DraggableListNoKey<T>(props: DraggableListNoKeyProps<T>) {
  const {
    className = '',
    data = eArr,
    onDataChange = ef,
    children,
    customStyle,
    checkable = true,
    multipleCheck = true,
    customDragHandler = false,
    noHoverStyle,
    ...otherProps
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  const [_this] = useState(() => ({
    mouseDownTargetTagName: '',
    lastChangeTime: 0,
  }));

  // 已复制的记录
  const [copyItem, setCopyItem] = useState<T[]>([]);

  // 正在拖拽的记录
  const [draggingSet, draggingHandle] = useSet<T>();
  // 已选中的记录
  const [_checkedSet, checkedHandle] = useSet<T>();
  const [emptySet] = useSet<T>();

  const checkedSet = checkable ? _checkedSet : emptySet;

  useEffect(() => {
    if (!checkable) {
      checkedHandle.reset();
    }
  }, [checkable]);

  const dragging = draggingSet.size > 0;

  const [insertFlag, setInsertFlag] = useState(-2);

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
    if (checkedSet.size > 0) {
      checkedHandle.reset();
    }
  }, rootRef);

  const cancelDrag = () => {
    setInsertFlag(-2);
    draggingHandle.reset();
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
      let startItem: T | undefined;
      for (let i = insertFlag; i >= 0; i -= 1) {
        if (!draggingSet.has(data[i])) {
          startItem = data[i];
          break;
        }
      }
      const tmp: T[] = [];
      const newData = data.filter((item) => {
        if (draggingSet.has(item)) {
          tmp.push(item);
          return false;
        }
        return true;
      });
      const startIndex = newData.findIndex((item) => item === startItem);
      newData.splice(startIndex + 1, 0, ...tmp);
      onDataChange(newData);
      setTimeout(cancelDrag, 16);
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
        'hover-style': !customStyle && !noHoverStyle,
        'internal-style': !customStyle,
      })} ${className}`}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (
          isCopy(e.nativeEvent) &&
          (e.target['tagName'] === 'DIV' || checkedSet.size > 1)
        ) {
          e.stopPropagation();
          const cache = new Set(data);
          const readyToCopy = [...checkedSet].filter((item) => cache.has(item));
          if (readyToCopy.length > 0) setCopyItem(readyToCopy);
        }
        if (isPaste(e.nativeEvent) && e.target['tagName'] === 'DIV') {
          e.stopPropagation();
          // 粘贴
          if (copyItem.length > 0) {
            const lastChecked = [...checkedSet][checkedSet.size - 1];
            let pasteIndex = data.findIndex((item) => item === lastChecked) + 1;
            if (pasteIndex <= 0) {
              pasteIndex = data.length;
            }
            // 粘贴数据
            const newCopyData = copyItem.map(deepClone);
            const newData = data.slice();
            newData.splice(pasteIndex, 0, ...newCopyData);
            onDataChange(newData);
            checkedHandle.reset();
            newCopyData.forEach(checkedHandle.add);
          }
        }
      }}
      {...otherProps}
    >
      {data.map((item, index) => {
        const currentChecked = checkedSet.has(item);
        const currentDragging = draggingSet.has(item);
        const changeItem = (changedItem: Partial<T>) => {
          const newItem = {
            ...item,
            ...changedItem,
          };
          onDataChange(changeArr(data, index, newItem));
          if (currentChecked) {
            checkedHandle.add(newItem);
          }
        };
        const moveUp = () => moveSingle(index, index - 1);
        const moveDown = () => moveSingle(index, index + 2);
        const removeItem = () => {
          onDataChange(removeArrIndex(data, index));
        };

        const dragItem = () => {
          if (currentChecked) {
            // 如果当前元素是已选择的，则拖拽所选元素
            draggingHandle.reset();
            [...checkedSet].forEach(draggingHandle.add);
          } else {
            // 拖拽了一个未选择元素，则单独选中该元素
            checkedHandle.reset();
            checkedHandle.add(item);
            draggingHandle.add(item);
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
            key={index}
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
              if (multipleCheck && shiftKey) {
                const [firstChecked] = [...checkedSet];
                // 连续选择模式
                let index1 = data.findIndex((item) => item === firstChecked);
                if (index1 < 0) index1 = 0;
                const start = Math.min(index, index1);
                const end = Math.max(index, index1) + 1;
                checkedHandle.reset();
                data.slice(start, end).forEach(checkedHandle.add);
              } else if (multipleCheck && ctrlKey) {
                // toggle模式s
                if (checkedSet.has(item)) {
                  checkedHandle.remove(item);
                } else {
                  checkedHandle.add(item);
                }
                // setChecked(
                //   toggleArr(checked, item.key).filter(key => key != null) as (
                //     | string
                //     | number
                //     )[],
                // );
              } else {
                // 单选模式
                checkedHandle.reset();
                checkedHandle.add(item);
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
      {dragging && <DraggingNum value={draggingSet.size} />}
    </div>
  );
}

export default DraggableListNoKey;
