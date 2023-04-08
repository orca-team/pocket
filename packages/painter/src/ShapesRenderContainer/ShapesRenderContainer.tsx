/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { ForwardedRef } from 'react';
import React, { forwardRef, useRef, useState } from 'react';
import cn from 'classnames';
import { changeArr } from '@orca-fe/tools';
import { useMergedRefs } from '@orca-fe/hooks';
import type { GraphShapeType } from '../def';
import ShapeRenderer from '../ShapeRenderer';
import useStyles from './ShapesRenderContainer.style';

const eArr = [];

const ef = () => undefined;

export interface ShapesRenderContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'defaultChecked'> {
  shapes?: GraphShapeType[];
  onShapesChange?: (shapes: GraphShapeType[], action: 'add' | 'change' | 'delete', index: number) => void;
  checked?: number;
  onCheck?: (checked: number) => void;
  onShapeClick?: (shape: GraphShapeType, index: number) => void;
  onShapeMouseEnter?: (shape: GraphShapeType, index: number) => void;
  onShapeMouseLeave?: (shape: GraphShapeType, index: number) => void;
  renderTransformingRect?: (shape: GraphShapeType, index: number) => React.ReactNode;
}

const ShapesRenderContainer = forwardRef((props: ShapesRenderContainerProps, pRef: ForwardedRef<HTMLDivElement>) => {
  const {
    className = '',
    shapes = eArr,
    onShapeClick = ef,
    onShapeMouseEnter = ef,
    onShapeMouseLeave = ef,
    checked,
    onCheck = ef,
    onShapesChange = ef,
    renderTransformingRect = () => null,
    ...otherProps
  } = props;
  const styles = useStyles();

  const _rootRef = useRef<HTMLDivElement>(null);
  const rootRef = useMergedRefs(_rootRef, pRef);

  const [svgRoot, setSvgRoot] = useState<SVGSVGElement | null>(null);

  const [cursor, setCursor] = useState<'default' | 'pointer'>('default');

  return (
    <div ref={rootRef} tabIndex={-1} className={cn(styles.root, { [styles.pointer]: cursor === 'pointer' }, className)} {...otherProps}>
      <svg ref={setSvgRoot} className={styles.svg} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" />
      {svgRoot &&
        shapes.map((shape, index) => (
          <ShapeRenderer
            key={index}
            shape={shape}
            svgRoot={svgRoot}
            onCheck={() => {
              onCheck(index);
            }}
            checked={checked === index}
            onShapeClick={() => {
              onShapeClick(shape, index);
            }}
            onShapeMouseEnter={() => {
              onShapeMouseEnter(shape, index);
              setCursor('pointer');
            }}
            onShapeMouseLeave={() => {
              onShapeMouseLeave(shape, index);
              setCursor('default');
            }}
            onShapeChange={(newShape) => {
              onShapesChange(changeArr(shapes, index, newShape), 'change', index);
            }}
            renderTransformingRect={() => renderTransformingRect(shape, index)}
          />
        ))}
    </div>
  );
});

export default ShapesRenderContainer;
