import React, { useEffect, useRef, useState } from 'react';
import { useClickAway, useControllableValue, useEventListener } from 'ahooks';
import { changeArr } from '@orca-fe/tools';
import cn from 'classnames';
import type { BasicTarget } from 'ahooks/lib/utils/domTarget';
import { useSizeListener } from '@orca-fe/hooks';
import useStyles from './TransformerLayout.style';
import type { Bounds } from '../TransformerBox/utils';
import TransformerBox from '../TransformerBox';

const eArr = [];

export type TransformerLayoutDataType = {
  bounds: Bounds;
};

export interface TransformerLayoutProps<T extends TransformerLayoutDataType>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {
  defaultData?: T[];
  data?: T[];
  onDataChange?: (data: T[]) => void;
  children?: (item: T, index: number) => React.ReactNode;
  defaultCheckedIndex?: number;
  checkedIndex?: number;
  onCheck?: (index: number) => void;
  clickAwayWhitelist?: BasicTarget[];
  limit?: boolean;
  layoutEvents?: boolean;
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

  return (
    <div ref={rootRef} className={cn(styles.root, { [styles.noEvents]: !layoutEvents }, className)} {...otherProps}>
      <div ref={setContentContainer} className={styles.contentContainer} />
      {contentContainer &&
        data.map((item, index) => {
          const { bounds } = item;
          return (
            <TransformerBox
              key={index}
              bounds={bounds}
              checked={checkedIndex === index}
              portal={() => contentContainer}
              limitBounds={limitBounds}
              onMouseDown={() => {
                setCheckedIndex(index);
              }}
              onBoundsChange={(bounds) => {
                setData(data =>
                  changeArr(data, index, {
                    ...item,
                    bounds,
                  }),
                );
              }}
            >
              {children(item, index)}
            </TransformerBox>
          );
        })}
    </div>
  );
};

export default TransformerLayout;
