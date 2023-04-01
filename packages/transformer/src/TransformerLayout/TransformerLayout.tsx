import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useClickAway, useControllableValue, useEventListener, useMemoizedFn } from 'ahooks';
import { changeArr, removeArrIndex } from '@orca-fe/tools';
import cn from 'classnames';
import type { BasicTarget } from 'ahooks/lib/utils/domTarget';
import { useSizeListener } from '@orca-fe/hooks';
import useStyles from './TransformerLayout.style';
import type { Bounds, Point } from '../TransformerBox/utils';
import TransformerBox from '../TransformerBox';
import type { TransformerBoxContextType } from '../TransformerBox/TransformerBoxContext';
import TransformerBoxContext from '../TransformerBox/TransformerBoxContext';

const eArr = [];

export type TransformerLayoutDataType = {
  bounds: Bounds;
};

export interface TransformerLayoutProps<T extends TransformerLayoutDataType>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {

  /** 默认边框数据列表 */
  defaultData?: T[];

  /** 边框数据列表 */
  data?: T[];

  /** 数据列表发生变化时的回调 */
  onDataChange?: (data: T[], action: 'change' | 'delete', index: number) => void;

  /** 渲染自定义子元素 */
  children?: (item: T, index: number) => React.ReactNode;

  /** 默认选中的元素下标 */
  defaultCheckedIndex?: number;

  /** 选中的元素下标 */
  checkedIndex?: number;

  /** 选中元素变化时的回调 */
  onCheck?: (index: number) => void;

  /** 点击白名单，当点击组件之外的元素时，会默认取消选中，如果你需要点击弹框之类的挂载在body下的元素，且不希望取消选中，可以考虑这个属性 */
  clickAwayWhitelist?: BasicTarget[];

  /** 是否限制元素移动范围，开启后，边框将不能拖拽到本组件之外的地方（以中心点为基准） */
  limit?: boolean;

  /** 是否开启布局div事件，为了实现空白区域的事件穿透（即不会挡住画布后面的内容），默认去除了画布上的点击事件响应，如果你需要开启，则使用该属性 */
  layoutEvents?: boolean;

  /** 缩放比例 scale = 2 ** zoom */
  zoom?: number;

  /** 是否支持 Box 旋转 */
  rotateEnable?: boolean;

  /** 删除事件 */
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  onDelete?: (index: number) => void | boolean | Promise<boolean>;
}

const TransformerLayout = <T extends TransformerLayoutDataType>(props: TransformerLayoutProps<T>) => {
  const {
    className = '',
    data: nouse1,
    onDataChange,
    defaultData,
    children = () => null,
    defaultCheckedIndex,
    checkedIndex: nouse2,
    onCheck,
    clickAwayWhitelist = eArr,
    limit = false,
    layoutEvents,
    zoom = 0,
    style,
    rotateEnable,
    onDelete = () => null,
    ...otherProps
  } = props;
  const styles = useStyles();
  const rootRef = useRef<HTMLDivElement>(null);

  const [_this] = useState<{
    size?: { width: number; height: number };
  }>({});

  const [limitBounds, setLimitBounds] = useState<Bounds | undefined>(undefined);

  useSizeListener((size) => {
    if (size.width > 0 && size.height > 0) {
      _this.size = size;
    }
    if (limit) {
      setLimitBounds({
        top: 0,
        left: 0,
        width: size.width,
        height: size.height,
      });
    } else {
      setLimitBounds(undefined);
    }
  }, rootRef);

  useEffect(() => {
    if (limit) {
      const { size } = _this;
      if (size) {
        setLimitBounds({
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
        });
      }
    } else {
      setLimitBounds(undefined);
    }
  }, [limit]);

  const [contentContainer, setContentContainer] = useState<HTMLElement | null>(null);

  const [data, setData] = useControllableValue<T[]>(props, {
    valuePropName: 'data',
    defaultValuePropName: 'defaultData',
    trigger: 'onDataChange',
  });

  const [checkedIndex = -1, setCheckedIndex] = useControllableValue<number>(props, {
    valuePropName: 'checkedIndex',
    defaultValuePropName: 'defaultCheckedIndex',
    trigger: 'onCheck',
    defaultValue: -1,
  });

  useEventListener(
    'mousedown',
    (ev) => {
      if (ev.target === ev.currentTarget || ev.target === contentContainer) {
        setCheckedIndex(-1);
      }
    },
    { target: rootRef },
  );

  useClickAway(() => {
    setCheckedIndex(-1);
  }, [rootRef, ...clickAwayWhitelist]);

  // 删除事件
  useEventListener(
    'keydown',
    async (ev) => {
      if (ev.key === 'Delete' || ev.key === 'Backspace') {
        if (checkedIndex >= 0) {
          const result = await onDelete(checkedIndex);
          if (result === false) {
            return;
          }
          // 修正下标
          setCheckedIndex((i) => {
            if (i > 0) return i - 1;
            if (data.length === 1) {
              return -1;
            }
            return i;
          });
          // 删除
          setData(d => removeArrIndex(d, checkedIndex), 'delete', checkedIndex);
        }
      }
    },
    { target: rootRef },
  );

  const getPointMapping = useMemoizedFn((p: Point) => ({
    x: p.x / 2 ** zoom,
    y: p.y / 2 ** zoom,
  }));

  const transformerBoxContext = useMemo<TransformerBoxContextType>(
    () => ({
      getPointMapping,
    }),
    [],
  );

  return (
    <div
      tabIndex={-1}
      ref={rootRef}
      className={cn(styles.root, { [styles.noEvents]: !layoutEvents }, className)}
      style={{
        // @ts-expect-error css variable
        '--transformer-layout-scale': 2 ** zoom,
        ...style,
      }}
      {...otherProps}
    >
      <div ref={setContentContainer} className={styles.contentContainer} />
      <TransformerBoxContext.Provider value={transformerBoxContext}>
        {contentContainer &&
          data.map((item, index) => {
            const { bounds } = item;
            return (
              <TransformerBox
                key={`${data.length}_${index}`}
                bounds={bounds}
                checked={checkedIndex === index}
                portal={() => contentContainer}
                limitBounds={limitBounds}
                rotateEnable={rotateEnable}
                onMouseDown={() => {
                  setCheckedIndex(index);
                }}
                onBoundsChange={(bounds) => {
                  setData(
                    data =>
                      changeArr(data, index, {
                        ...item,
                        bounds,
                      }),
                    'change',
                    index,
                  );
                }}
              >
                {children(item, index)}
              </TransformerBox>
            );
          })}
      </TransformerBoxContext.Provider>
    </div>
  );
};

export default TransformerLayout;
