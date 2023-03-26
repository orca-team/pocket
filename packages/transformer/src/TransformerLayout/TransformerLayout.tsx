import React, { useRef } from 'react';
import { useClickAway, useControllableValue, useEventListener } from 'ahooks';
import { changeArr } from '@orca-fe/tools';
import type { BasicTarget } from 'ahooks/lib/utils/domTarget';
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
    ...otherProps
  } = props;
  const styles = useStyles();
  const rootRef = useRef<HTMLDivElement>(null);

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
      if (ev.target === ev.currentTarget) {
        setCheckedIndex(-1);
      }
    },
    { target: rootRef },
  );

  useClickAway(() => {
    setCheckedIndex(-1);
  }, [rootRef, ...clickAwayWhitelist]);

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`} {...otherProps}>
      {data.map((item, index) => {
        const { bounds } = item;
        return (
          <TransformerBox
            key={index}
            bounds={bounds}
            checked={checkedIndex === index}
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
