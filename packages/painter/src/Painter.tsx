import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Konva from 'konva';
import { useEventListener, useMemoizedFn } from 'ahooks';
import { useSizeDebounceListener, useStaticClick } from '@orca-fe/hooks';
import useStyle from './Painter.style';
import ShapeCreator from './ShapeCreator';
import { createOrUpdateShape, createShape, normalizeShape } from './utils';
import type { ShapeDataType, ShapeType } from './def';

export type { ShapeDataType, ShapeType };

const ef = () => undefined;

export type PainterRef = {
  draw: (shapeType: ShapeType, attr?: Record<string, any>) => void;
  cancelDraw: () => void;
  addShapes: (shapeData: ShapeDataType | ShapeDataType[]) => void;
  updateShape: (index: number, shapeData: Partial<ShapeDataType>) => void;
  removeShape: (index: number) => void;
  clearShapes: () => void;
  check: (index: number | number[]) => void;
  unCheck: () => void;
  getShapes: () => ShapeDataType[];
  isDrawing: () => boolean;
};

export interface PainterProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
  height?: number;
  onInit?: () => void;
  onDestroyed?: () => void;
  onCheck?: (index: number) => void;
  onCancelCheck?: () => void;
  defaultDrawMode?: DrawMode | false;
  onDraw?: () => void;
  onDataChange?: () => void;
  drawOnce?: boolean;
}

export type DrawMode = { shapeType: ShapeType; attr?: Record<string, any> };
const Painter = React.forwardRef<PainterRef, PainterProps>((props, pRef) => {
  const {
    className = '',
    width = 800,
    height = 300,
    onInit = ef,
    onDestroyed = ef,
    onCheck = ef,
    onCancelCheck = ef,
    onDraw = ef,
    onDataChange = ef,
    defaultDrawMode = false,
    drawOnce,
    ...otherProps
  } = props;
  const styles = useStyle();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 绘画模式
  const [drawMode, setDrawMode] = useState<DrawMode | false>(defaultDrawMode);

  const [_this] = useState<{
    stage?: Konva.Stage;
    layer?: Konva.Layer;
    drawingShape?: Konva.Shape;
    shapes: Konva.Shape[];
    transformer?: Konva.Transformer;
    dragging?: boolean;
    hovering?: boolean;
    transforming?: boolean;
  }>({
    shapes: [],
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

  const unCheck = useMemoizedFn(() => {
    if (_this.transformer) _this.transformer.destroy();
    _this.transforming = false;
  });

  const check = useMemoizedFn((_shapes: Konva.Shape | Konva.Shape[]) => {
    const shapes = Array.isArray(_shapes) ? _shapes : [_shapes];
    if (_this.layer) {
      unCheck();
      _this.transforming = true;
      const transformer = new Konva.Transformer({
        nodes: shapes,
        keepRatio: false,
      });
      transformer.on('transformend', () => {
        shapes.forEach((shape) => {
          normalizeShape(shape);
          shape.draw();
        });
        onDataChange();
      });
      _this.layer.add(transformer);
      _this.transformer = transformer;
    }
  });

  const cursorMove = useMemoizedFn(() => {
    rootRef.current?.classList.add(...styles.move.split(' '));
    _this.hovering = true;
  });
  const cursorMoveEnd = useMemoizedFn(() => {
    rootRef.current?.classList.remove(...styles.move.split(' '));
    _this.hovering = false;
  });

  /**
   * 添加图形
   */
  const addShapes = useMemoizedFn(
    (_shapes: ShapeDataType | ShapeDataType[]) => {
      const shapes = Array.isArray(_shapes) ? _shapes : [_shapes];
      const newShapes = shapes.map((shapeData) => {
        const shape = createShape(shapeData);
        shape.fillEnabled(false);
        shape.draggable(true);
        shape.setAttr('hitStrokeWidth', 4);
        shape.on('click', (ev) => {
          check(shape);
          onCheck(_this.shapes.findIndex((s) => s === shape));
        });
        shape.on('mouseenter', () => {
          cursorMove();
        });
        shape.on('mouseleave', () => {
          cursorMoveEnd();
        });
        shape.on('dragstart', () => {
          cursorMove();
        });
        shape.on('dragend', () => {
          cursorMoveEnd();
          normalizeShape(shape);
          onDataChange();
        });
        return shape;
      });
      _this.shapes.push(...newShapes);
      if (_this.layer) {
        _this.layer.add(...newShapes);
        _this.layer.draw();
      }
    },
  );

  const checkIndex = useMemoizedFn<PainterRef['check']>((_index) => {
    const index = Array.isArray(_index) ? _index : [_index];
    check(index.map((i) => _this.shapes[i]));
  });

  const getShapes = useMemoizedFn<PainterRef['getShapes']>(() =>
    _this.shapes.map((shape) => shape.getAttrs()),
  );
  const clearShapes = useMemoizedFn<PainterRef['clearShapes']>(() => {
    _this.shapes.forEach((shape) => {
      shape.destroy();
    });
    _this.shapes = [];
    _this.dragging = false;
    unCheck();
    cursorMoveEnd();
  });
  const updateShape = useMemoizedFn<PainterRef['updateShape']>(
    (index, shapeData) => {
      if (index >= 0 && index < _this.shapes.length) {
        _this.shapes[index].setAttrs(shapeData);
      }
    },
  );
  const removeShape = useMemoizedFn<PainterRef['removeShape']>((index) => {
    if (index >= 0 && index < _this.shapes.length) {
      const removed = _this.shapes.splice(index, 1);
      removed.forEach((shape) => {
        shape.destroy();
      });
      unCheck();
      cursorMoveEnd();
    }
  });
  const isDrawing = useMemoizedFn<PainterRef['isDrawing']>(() => !!drawMode);

  useImperativeHandle(pRef, () => ({
    draw,
    cancelDraw,
    addShapes,
    unCheck,
    check: checkIndex,
    getShapes,
    isDrawing,
    clearShapes,
    removeShape,
    updateShape,
  }));

  useStaticClick(
    (ev) => {
      if (!_this.dragging && !_this.hovering) {
        // 点击空白区域，取消选中
        unCheck();
        onCancelCheck();
      }
    },
    {
      target: rootRef,
    },
  );

  useEventListener('keydown', (ev) => {
    if (
      ev.key === 'Escape' &&
      !ev.altKey &&
      !ev.shiftKey &&
      !ev.metaKey &&
      !ev.ctrlKey
    ) {
      // 按下 Escape 快捷键 取消选中
      unCheck();
      onCancelCheck();
    }
  });

  const scalePainter = useMemoizedFn(() => {
    if (_this.stage && _this.layer) {
      const size = _this.stage.getSize();
      const ratio = Math.min(size.width / width, size.height / height);
      const x = 0.5 * (size.width - ratio * width);
      const y = 0.5 * (size.height - ratio * height);
      _this.layer.x(x);
      _this.layer.y(y);
      _this.layer.scale({ x: ratio, y: ratio });
    }
  });

  useEffect(() => {
    const container = canvasRef.current;
    if (container) {
      const stage = new Konva.Stage({
        container,
        width: container.clientWidth,
        height: container.clientHeight,
      });

      // then create layer
      const layer = new Konva.Layer();

      // add the layer to the stage
      stage.add(layer);

      _this.stage = stage;
      _this.layer = layer;

      // draw the image
      scalePainter();
      layer.draw();
      onInit();

      return () => {
        _this.stage = undefined;
        stage.destroy();
        onDestroyed();
      };
    }
    return undefined;
  }, []);

  useSizeDebounceListener((size, scale) => {
    const dom = canvasRef.current;
    if (scale) {
      if (dom) {
        dom.style.transformOrigin = 'top left';
        dom.style.transform = `scale(${scale.x},${scale.y})`;
      }
      // console.log('scale', size, scale);
    } else {
      if (dom) {
        dom.style.transformOrigin = '';
        dom.style.transform = '';
      }
      _this.stage?.setSize(size);
      scalePainter();
    }
  }, canvasRef);

  return (
    <div
      tabIndex={-1}
      ref={rootRef}
      className={`${styles.root} ${className}`}
      {...otherProps}
    >
      <div ref={canvasRef} className={styles.canvasContainer} />
      {drawMode && (
        <ShapeCreator
          shapeType={drawMode.shapeType}
          pointMapping={(point) => {
            if (_this.layer) {
              // console.log(_this.layer.getTransform().decompose());
              return _this.layer.getTransform().copy().invert().point(point);
            }
            return point;
          }}
          onDrawing={(shape) => {
            if (_this.layer) {
              const newShape = createOrUpdateShape(
                {
                  ...shape,
                  ...drawMode.attr,
                },
                _this.drawingShape,
              );
              if (newShape) {
                if (_this.drawingShape) {
                  _this.drawingShape.destroy();
                }
                _this.drawingShape = newShape;
                _this.layer.add(newShape);
              }
              _this.layer.draw();
            }
          }}
          onCreate={(shape) => {
            if (_this.layer) {
              _this.drawingShape?.destroy();
              _this.drawingShape = undefined;
              addShapes({
                ...shape,
                ...drawMode.attr,
              });
              if (drawOnce) {
                setDrawMode(false);
              }
              onDraw();
              onDataChange();
            }
          }}
        />
      )}
    </div>
  );
});

export const usePainterRef = () => useRef<PainterRef>(null);

export default Painter;
