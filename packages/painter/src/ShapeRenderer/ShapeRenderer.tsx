import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import type { Bounds } from '@orca-fe/transformer';
import { TransformerBox, TransformerLine } from '@orca-fe/transformer';
import cn from 'classnames';
import type { GraphShapeType, LineShapeType } from '../def';
import useStyles from './ShapeRenderer.style';

const ef = () => undefined;

function getNewShape(shape: Exclude<GraphShapeType, LineShapeType>, originBounds: Bounds, newBounds: Bounds) {
  // 新旧宽度和高度的比例
  const ratio = {
    width: newBounds.width / originBounds.width,
    height: newBounds.height / originBounds.height,
  };
  const newShape = {
    ...shape,
  };
  newShape.x = newBounds.left;
  newShape.y = newBounds.top;
  newShape.width = newBounds.width;
  newShape.height = newBounds.height;
  newShape.rotate = newBounds.rotate || 0;
  // 对特殊图形进行特殊处理
  switch (newShape.type) {
    case 'line-path':
      newShape.points = newShape.points.map(([x, y]) => [
        (x - originBounds.left) * ratio.width + newBounds.left,
        (y - originBounds.top) * ratio.height + newBounds.top,
      ]);
      break;
    default:
  }
  return newShape;
}

export interface ShapeRendererProps<T extends GraphShapeType>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'defaultChecked'> {
  shape: T;
  onShapeChange?: (shape: T) => void;
  checked?: boolean;
  onCheck?: () => void;
  onShapeClick?: () => void;
  onShapeMouseEnter?: () => void;
  onShapeMouseLeave?: () => void;
  svgRoot: SVGSVGElement;
  renderTransformingRect?: () => React.ReactNode;
}

const ShapeRenderer = <T extends GraphShapeType>(props: ShapeRendererProps<T>) => {
  const {
    className = '',
    shape: _shape,
    onShapeClick = ef,
    onShapeMouseEnter = ef,
    onShapeMouseLeave = ef,
    onShapeChange = ef,
    checked,
    onCheck = ef,
    svgRoot,
    renderTransformingRect = () => null,
    ...otherProps
  } = props;
  const styles = useStyles();

  const [tmpShape, setTmpShape] = useState<GraphShapeType | null>(null);

  const shape = tmpShape || _shape;

  return (
    <div className={cn(styles.root, className)} {...otherProps}>
      {svgRoot &&
        (() => {
          let element: React.ReactElement | null = null;
          const strokeStyle = {
            stroke: shape.stroke,
            strokeWidth: shape.strokeWidth,
          };
          switch (shape.type) {
            case 'ellipse':
              element = (
                <ellipse
                  cx={shape.x + 0.5 * shape.width}
                  cy={shape.y + 0.5 * shape.height}
                  rx={0.5 * shape.width}
                  ry={0.5 * shape.height}
                  style={{
                    transformOrigin: `${shape.x}px ${shape.y}px`,
                    transform: `rotate(${shape.rotate}deg)`,
                  }}
                  {...strokeStyle}
                />
              );
              break;
            case 'line':
              element = <line x1={shape.point1[0]} y1={shape.point1[1]} x2={shape.point2[0]} y2={shape.point2[1]} />;
              break;
            case 'rectangle':
              element = (
                <rect
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  rotate={`${shape.rotate}deg`}
                  style={{
                    transformOrigin: `${shape.x}px ${shape.y}px`,
                    transform: `rotate(${shape.rotate}deg)`,
                  }}
                  {...strokeStyle}
                />
              );
              break;
            case 'line-path':
              element = (
                <path
                  d={shape.points.map(([x, y], index) => `${(index === 0 ? 'M' : 'L') + x} ${y}`).join('')}
                  rotate={`${shape.rotate}deg`}
                  style={{
                    transformOrigin: `${shape.x}px ${shape.y}px`,
                    transform: `rotate(${shape.rotate}deg)`,
                  }}
                  {...strokeStyle}
                />
              );
              break;
            default:
          }
          if (element) {
            const svgElement = (
              <>
                {element}
                {React.cloneElement(element, {
                  className: styles.svgHit,
                  onClick: () => {
                    onShapeClick();
                    onCheck();
                  },
                  onMouseEnter: () => {
                    onShapeMouseEnter();
                  },
                  onMouseLeave: () => {
                    onShapeMouseLeave();
                  },
                })}
              </>
            );

            if (shape.type === 'line') {
              return (
                <>
                  {ReactDOM.createPortal(svgElement, svgRoot)}
                  <TransformerLine
                    checked={checked}
                    points={[
                      {
                        x: shape.point1[0],
                        y: shape.point1[1],
                      },
                      {
                        x: shape.point2[0],
                        y: shape.point2[1],
                      },
                    ]}
                    onPointsChange={(newPoints) => {
                      setTmpShape({
                        ...shape,
                        point1: [newPoints[0].x, newPoints[0].y],
                        point2: [newPoints[1].x, newPoints[1].y],
                      });
                    }}
                    onChangeEnd={(newPoints) => {
                      onShapeChange({
                        ...shape,
                        point1: [newPoints[0].x, newPoints[0].y],
                        point2: [newPoints[1].x, newPoints[1].y],
                      } as T);
                      setTmpShape(null);
                    }}
                  >
                    {checked && renderTransformingRect()}
                  </TransformerLine>
                </>
              );
            }

            const bounds = {
              left: shape.x,
              top: shape.y,
              height: shape.height,
              width: shape.width,
              rotate: shape.rotate,
            };

            return (
              <TransformerBox
                controlledMode
                checked={checked}
                bounds={bounds}
                rotateEnabled
                onBoundsChange={(newTmpBounds) => {
                  setTmpShape(getNewShape(shape, bounds, newTmpBounds));
                }}
                onChangeEnd={(newBounds) => {
                  onShapeChange(getNewShape(shape, bounds, newBounds) as T);
                  setTmpShape(null);
                }}
              >
                {checked && renderTransformingRect()}
                {ReactDOM.createPortal(svgElement, svgRoot)}
              </TransformerBox>
            );
          }
          return null;
        })()}
    </div>
  );
};

export default ShapeRenderer;
