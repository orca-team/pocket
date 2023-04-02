import type { Ref } from 'react';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import useStyle from './Painter.style';
import ShapeCreator from './ShapeCreator';
import type { GraphShapeType, ShapeDataType, ShapeType } from './def';
import { isGraphShapeType } from './def';
import ShapeRenderer from './ShapeRenderer';

export type { ShapeDataType, ShapeType };

// const ef = () => undefined;

export type PainterRef = {
  draw: (shapeType: ShapeType, attr?: Record<string, any>) => void;
  cancelDraw: () => void;
  isDrawing: () => boolean;
};

export type DrawMode = { shapeType: ShapeType; attr?: Record<string, any> };

export interface PainterProps<T extends ShapeDataType> extends React.HTMLAttributes<HTMLDivElement> {
  zoom?: number;
  defaultDrawMode?: DrawMode;
  defaultData?: T[];
  data?: T[];
  onDataChange?: (data: T[], action: 'add' | 'change' | 'remove', index: number) => void;
}

const Painter = forwardRef(function <T extends ShapeDataType>(props: PainterProps<T>, pRef: Ref<PainterRef>) {
  const { className = '', zoom, defaultDrawMode = false, data: nouse1, defaultData: nouse2, onDataChange: nouse3, ...otherProps } = props;
  const styles = useStyle();
  const rootRef = useRef<HTMLDivElement>(null);

  // 图形数据
  const [data, setData] = useControllableValue<T[]>(props, {
    defaultValue: [],
    valuePropName: 'data',
    trigger: 'onDataChange',
    defaultValuePropName: 'defaultData',
  });

  const graphShapeList = useMemo(() => data.filter(shape => isGraphShapeType(shape)), [data]);
  // const imageList = useMemo(() => data.filter(shape => (isImageType(shape))), [data]);

  // 临时绘制图形
  const [tempShape, setTempShape] = useState<GraphShapeType | false>(false);

  // 合并后的图形数据
  const mergedGraphShapeData = useMemo(() => {
    if (tempShape) {
      return [...graphShapeList, tempShape];
    }
    return graphShapeList;
  }, [graphShapeList, tempShape]);

  // 绘画模式
  const [drawMode, setDrawMode] = useState<DrawMode | false>(defaultDrawMode);

  const draw = useMemoizedFn<PainterRef['draw']>((type, attr) => {
    setDrawMode({
      attr,
      shapeType: type,
    });
  });

  const cancelDraw = useMemoizedFn<PainterRef['cancelDraw']>(() => {
    setDrawMode(false);
  });

  useImperativeHandle(
    pRef,
    () => ({
      draw,
      cancelDraw,
      isDrawing: () => !!drawMode,
    }),
    [],
  );

  return (
    <div
      tabIndex={-1}
      ref={rootRef}
      className={`${styles.root} ${className}`}
      // onBlur={() => { unCheck(); }}
      {...otherProps}
    >
      <ShapeRenderer shapes={mergedGraphShapeData as GraphShapeType[]} />
      {drawMode && (
        <ShapeCreator
          shapeType={drawMode.shapeType}
          onDrawing={(shape) => {
            setTempShape(shape);
          }}
          onCancel={() => {
            setDrawMode(false);
            setTempShape(false);
          }}
          onCreate={(shape) => {
            setData(data => [...data, shape as T]);
            setDrawMode(false);
            setTempShape(false);
          }}
        />
      )}
    </div>
  );
});

export const usePainterRef = () => useRef<PainterRef>(null);

export default Painter;
