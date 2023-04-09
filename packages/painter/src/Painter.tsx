import type { Ref } from 'react';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import { useCombineKeyListener, useStaticClick } from '@orca-fe/hooks';
import type { TransformerBoxContextType } from '@orca-fe/transformer';
import { TransformerBoxContext, TransformerLayout } from '@orca-fe/transformer';
import { Img } from '@orca-fe/pocket';
import { changeArr, removeArrIndex } from '@orca-fe/tools';
import ShapeCreator from './ShapeCreator';
import type { GraphShapeType, ImageType, ShapeDataType, ShapeType } from './def';
import { isGraphShapeType, isImageType } from './def';
import ShapesRenderContainer from './ShapesRenderContainer';
import useStyle from './Painter.style';

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

type Action = 'add' | 'change' | 'delete';

export interface PainterProps<T extends ShapeDataType> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultChecked'> {

  /** 缩放比例 */
  zoom?: number;

  /** 默认绘画模式 */
  defaultDrawMode?: DrawMode | false;

  drawMode?: DrawMode | false;

  onDrawModeChange?: (drawMode: DrawMode | false) => void;

  /** 默认图形数据 */
  defaultData?: T[];

  /** 图形数据 */
  data?: T[];

  /** 图形数据变化回调 */
  onDataChange?: (data: T[], action: Action, index: number) => void;

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

  /** 自动选择最后创建的元素 */
  autoCheck?: boolean;

  /** 开始拖拽事件 */
  onChangeStart?: (index: number) => void;
}

const Painter = forwardRef(function <T extends ShapeDataType>(props: PainterProps<T>, pRef: Ref<PainterRef>) {
  const {
    className = '',
    zoom = 0,
    defaultDrawMode,
    drawMode: nouse5,
    onDrawModeChange,
    data: nouse1,
    defaultData: nouse2,
    onDataChange: nouse3,
    renderTransformingRect = () => null,
    defaultChecked,
    checked: nouse4,
    onCheck,
    onCancelDraw = ef,
    style,
    autoCheck = true,
    onChangeStart = ef,
    ...otherProps
  } = props;
  const styles = useStyle();
  const rootRef = useRef<HTMLDivElement>(null);

  const shapeRendererRef = useRef<HTMLDivElement>(null);

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

  // 将 data 拆分为 graphShapeList 和 imageList，并保留 index 映射
  const {
    graphShapeList,
    imageList,
    graphIndexMap: shapeIndexMap,
    imageIndexMap,
    dataIndexMap,
    dataTypeMap,
  } = useMemo(() => {
    const graphShapeList: GraphShapeType[] = [];
    const imageList: ImageType[] = [];
    const dataIndexMap: Record<number, number> = {};
    const dataTypeMap: Record<number, 'shape' | 'image'> = {};
    const graphIndexMap: Record<number, number> = {};
    const imageIndexMap: Record<number, number> = {};
    data.forEach((item, index) => {
      if (isGraphShapeType(item)) {
        graphShapeList.push(item);
        graphIndexMap[graphShapeList.length - 1] = index;
        dataIndexMap[index] = graphShapeList.length - 1;
        dataTypeMap[index] = 'shape';
      } else if (isImageType(item)) {
        imageList.push(item);
        imageIndexMap[imageList.length - 1] = index;
        dataIndexMap[index] = imageList.length - 1;
        dataTypeMap[index] = 'image';
      }
    });
    return {
      dataTypeMap,
      graphShapeList,
      imageList,
      graphIndexMap,
      imageIndexMap,
      dataIndexMap,
    };
  }, [data]);

  // 分析当前选中的是图形还是图片
  const checkedShape = dataTypeMap[checked] === 'shape' ? dataIndexMap[checked] ?? -1 : -1;
  const checkedImage = dataTypeMap[checked] === 'image' ? dataIndexMap[checked] ?? -1 : -1;

  const imageListWithBounds = useMemo(
    () =>
      imageList.map((image) => {
        // 为 imageList 添加 bounds 数据
        const img = image;
        return {
          ...img,
          bounds: {
            left: img.x,
            top: img.y,
            width: img.width,
            height: img.height,
            rotate: img.rotate,
          },
        };
      }),
    [imageList],
  );

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
  const [drawMode, setDrawMode] = useControllableValue<DrawMode | false>(props, {
    defaultValuePropName: 'defaultDrawMode',
    trigger: 'onDrawModeChange',
    valuePropName: 'drawMode',
  });

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

  // 删除事件
  useCombineKeyListener(
    'Delete,Backspace',
    async () => {
      let deleteIndex = -1;
      if (checkedImage >= 0) {
        // 选中了图片
        deleteIndex = imageIndexMap[checkedImage];
      }
      if (checkedShape >= 0) {
        // 选中了图片
        deleteIndex = shapeIndexMap[checkedShape];
      }

      if (deleteIndex >= 0) {
        // 修正下标
        let i = deleteIndex;
        if (i > 0) {
          i -= 1;
        } else if (data.length === 1) {
          i = -1;
        }
        setChecked(i);

        setData(removeArrIndex(data, deleteIndex), 'delete', deleteIndex);
      }
    },
    { target: rootRef },
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
        <TransformerLayout
          className={styles.transformerLayout}
          data={imageListWithBounds}
          checkedIndex={checkedImage}
          onCheck={(index) => {
            setChecked(imageIndexMap[index] ?? -1);
          }}
          zoom={zoom}
          rotateEnabled
          disableClickAway
          onDelete={() => false}
          onChangeStart={onChangeStart}
          onDataChange={(data, action, index) => {
            // 修改图片数据
            const dataIndex = imageIndexMap[index];
            setData(
              (oldData) => {
                if (action === 'change') {
                  // 仅取出变化的图形数据，更新到全量数据
                  const item = data[index];
                  const { bounds, ...rest } = item;
                  return changeArr(oldData, dataIndex, {
                    ...rest,
                    x: bounds.left,
                    y: bounds.top,
                    width: bounds.width,
                    height: bounds.height,
                    rotate: bounds.rotate,
                  } as T);
                } else if (action === 'delete') {
                  // 删除数据
                  return removeArrIndex(oldData, dataIndex);
                }
                return oldData;
              },
              action,
              dataIndex,
            );
          }}
          style={{
            '--transformer-layout-scale': 'var(--scale-factor)',
          }}
        >
          {item => <Img className={styles.img} src={item.src} />}
        </TransformerLayout>
        <ShapesRenderContainer
          ref={shapeRendererRef}
          checked={checkedShape}
          onCheck={(index) => {
            setChecked(shapeIndexMap[index] ?? -1);
          }}
          shapes={mergedGraphShapeData}
          onChangeStart={onChangeStart}
          onShapesChange={(newShapes, action, index) => {
            // 修改图形数据
            const dataIndex = shapeIndexMap[index];
            setData(
              (oldData) => {
                if (action === 'change') {
                  // 仅取出变化的图形数据，更新到全量数据
                  return changeArr(oldData, dataIndex, newShapes[index] as T);
                } else if (action === 'delete') {
                  // 删除数据
                  return removeArrIndex(oldData, dataIndex);
                }
                return oldData;
              },
              action,
              dataIndex,
            );
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
            // 创建图形数据
            setData([...data, { ...shape, ...drawMode.attr } as T], 'add', data.length);
            if (autoCheck) {
              setChecked(data.length);
              // 退出绘图模式
              setDrawMode(false);
            }
          }}
        />
      )}
    </div>
  );
});

export const usePainterRef = () => useRef<PainterRef>(null);

export default Painter;
