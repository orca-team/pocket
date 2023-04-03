import type { Ref } from 'react';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import { useStaticClick } from '@orca-fe/hooks';
import type { TransformerBoxContextType } from '@orca-fe/transformer';
import { TransformerBoxContext } from '@orca-fe/transformer';
import useStyle from './Painter.style';
import ShapeCreator from './ShapeCreator';
import type { GraphShapeType, ShapeDataType, ShapeType } from './def';
import { isGraphShapeType } from './def';
import ShapesRenderContainer from './ShapesRenderContainer';

export type { ShapeDataType, ShapeType };

const ef = () => undefined;

export type PainterRef = {

  /**
   * 绘制图形
   * @param {ShapeType} shapeType - 图形类型
   * @param {Record<string, any>} attr - 图形属性
   */
  draw: (shapeType: ShapeType, attr?: Record<string, any>) => void;

  /**
   * 取消绘制
   */
  cancelDraw: () => void;

  /**
   * 是否正在绘制
   * @returns {boolean} - 是否正在绘制
   */
  isDrawing: () => boolean;

  /**
   * 获取根元素
   * @returns {HTMLElement | null} - 根元素
   */
  getRoot: () => HTMLElement | null;
};

export type DrawMode = { shapeType: ShapeType; attr?: Record<string, any> };

export interface PainterProps<T extends ShapeDataType> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultChecked'> {

  /** 缩放比例 */
  zoom?: number;

  /** 默认绘画模式 */
  defaultDrawMode?: DrawMode;

  /** 默认图形数据 */
  defaultData?: T[];

  /** 图形数据 */
  data?: T[];

  /** 图形数据变化回调 */
  onDataChange?: (data: T[], action: 'add' | 'change' | 'delete', index: number) => void;

  /** 渲染变换框 */
  renderTransformingRect?: (shape: T, index: number) => React.ReactNode;

  /** 默认选中项 */
  defaultChecked?: number;

  /** 选中项 */
  checked?: number;

  /** 选中项变化回调 */
  onCheck?: (checked: number) => void;

  /** 取消绘图 */
  onCancelDraw?: () => void;
}

const Painter = forwardRef(function <T extends ShapeDataType>(props: PainterProps<T>, pRef: Ref<PainterRef>) {
  const {
    className = '',
    zoom = 0,
    defaultDrawMode = false,
    data: nouse1,
    defaultData: nouse2,
    onDataChange: nouse3,
    renderTransformingRect = () => null,
    defaultChecked,
    checked: nouse4,
    onCheck,
    onCancelDraw = ef,
    style,
    ...otherProps
  } = props;
  const styles = useStyle();
  const rootRef = useRef<HTMLDivElement>(null);

  const [checked, setChecked] = useControllableValue<number>(props, {
    defaultValue: -1,
    valuePropName: 'checked',
    defaultValuePropName: 'defaultChecked',
    trigger: 'onCheck',
  });

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

  const isDrawing = useMemoizedFn(() => !!drawMode);
  const getRoot = useMemoizedFn(() => rootRef.current);
  useImperativeHandle(
    pRef,
    () => ({
      draw,
      cancelDraw,
      isDrawing,
      getRoot,
    }),
    [],
  );

  useStaticClick((e) => {
    const root = rootRef.current;
    if (root && (root === e.target || !root.contains(e.target as Node))) {
      setChecked(-1);
    }
  });

  const getPointMapping = useMemoizedFn<TransformerBoxContextType['getPointMapping']>(point => ({
    x: point.x / 2 ** zoom,
    y: point.y / 2 ** zoom,
  }));
  const context = useMemo<TransformerBoxContextType>(
    () => ({
      getPointMapping,
    }),
    [],
  );

  return (
    <div
      tabIndex={-1}
      ref={rootRef}
      className={`${styles.root} ${className}`}
      // onBlur={() => { unCheck(); }}
      style={{
        '--painter-scale': 2 ** zoom,
        ...style,
      }}
      {...otherProps}
    >
      <TransformerBoxContext.Provider value={context}>
        <ShapesRenderContainer
          checked={checked}
          onCheck={setChecked}
          shapes={mergedGraphShapeData as GraphShapeType[]}
          onShapesChange={(newShapes, action, index) => {
            setData(newShapes as T[], action, index);
          }}
          renderTransformingRect={renderTransformingRect as PainterProps<GraphShapeType>['renderTransformingRect']}
        />
      </TransformerBoxContext.Provider>
      {drawMode && (
        <ShapeCreator
          pointMapping={getPointMapping}
          shapeType={drawMode.shapeType}
          onCancel={() => {
            setTempShape(false);
            setDrawMode(false);
            onCancelDraw();
          }}
          onDrawing={(shape) => {
            setTempShape({
              ...shape,
              ...drawMode.attr,
            });
          }}
          onCreate={(shape) => {
            setTempShape(false);
            setData(data => [...data, { ...shape, ...drawMode.attr } as T]);
          }}
        />
      )}
    </div>
  );
});

export const usePainterRef = () => useRef<PainterRef>(null);

export default Painter;
