import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Konva from 'konva';
import { useMemoizedFn } from 'ahooks';
import { useSizeListener } from '@orca-fe/hooks';
import useStyle from './Painter.style';
import ShapeCreator from './ShapeCreator';
import { createOrUpdateShape, createShape, normalizeShape } from './utils';
import type { ShapeDataType, ShapeType } from './def';

const ef = () => undefined;

export type PainterRef = {
  draw: (shapeType: ShapeType) => void;
};

export interface PainterProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
  height?: number;
  onInit?: () => void;
}

const Painter = React.forwardRef<PainterRef, PainterProps>((props, pRef) => {
  const {
    className = '',
    width = 800,
    height = 300,
    onInit = ef,
    ...otherProps
  } = props;
  const styles = useStyle();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 绘画模式
  const [drawType, setDrawType] = useState<ShapeType | false>(false);

  const [_this] = useState<{
    stage?: Konva.Stage;
    layer?: Konva.Layer;
    drawingShape?: Konva.Shape;
    shapes: Konva.Shape[];
    transformer?: Konva.Transformer;
  }>({
    shapes: [],
  });

  const draw = useMemoizedFn<PainterRef['draw']>((type) => {
    setDrawType(type);
  });

  const transformShape = useMemoizedFn(
    (_shapes: Konva.Shape | Konva.Shape[]) => {
      const shapes = Array.isArray(_shapes) ? _shapes : [_shapes];
      if (_this.layer) {
        if (_this.transformer) _this.transformer.destroy();
        const transformer = new Konva.Transformer({
          nodes: shapes,
          keepRatio: false,
        });
        transformer.on('transformend', () => {
          shapes.forEach((shape) => {
            normalizeShape(shape);
            shape.draw();
          });
        });
        _this.layer.add(transformer);
        _this.transformer = transformer;
      }
    },
  );

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
          transformShape(shape);
        });
        shape.on('mouseenter', () => {
          rootRef.current?.classList.add(...styles.move.split(' '));
        });
        shape.on('mouseleave', () => {
          rootRef.current?.classList.remove(...styles.move.split(' '));
        });
        shape.on('dragstart', () => {
          rootRef.current?.classList.add(...styles.move.split(' '));
        });
        shape.on('dragend', () => {
          rootRef.current?.classList.remove(...styles.move.split(' '));
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

  useImperativeHandle(pRef, () => ({
    draw,
  }));

  const scalePainter = useMemoizedFn(() => {
    if (_this.stage && _this.layer) {
      const size = _this.stage.getSize();
      const ratio = Math.max(size.width / width, size.height / height);
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
      };
    }
    return undefined;
  }, []);

  useSizeListener((size) => {
    _this.stage?.setSize(size);
    scalePainter();
  }, rootRef);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className}`}
      {...otherProps}
    >
      <div ref={canvasRef} className={styles.canvasContainer} />
      {drawType && (
        <ShapeCreator
          shapeType={drawType}
          pointMapping={(point) => {
            if (_this.layer) {
              // console.log(_this.layer.getTransform().decompose());
              return _this.layer.getTransform().copy().invert().point(point);
            }
            return point;
          }}
          onDrawing={(shape) => {
            if (_this.layer) {
              const newShape = createOrUpdateShape(shape, _this.drawingShape);

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
              addShapes(shape);
              setDrawType(false);
            }
          }}
        />
      )}
    </div>
  );
});

export const usePainterRef = () => useRef<PainterRef>(null);

export default Painter;
