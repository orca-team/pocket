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
  onChangeStart?: () => void;
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
    onChangeStart = ef,
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
            case 'mark':
              element = (
                <g>
                  <rect
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    rotate={`${shape.rotate}deg`}
                    style={{
                      fill: 'rgba(255, 77, 79, 0.05)',
                      transformOrigin: `${shape.x}px ${shape.y}px`,
                      transform: `rotate(${shape.rotate}deg)`,
                    }}
                    {...strokeStyle}
                  />

                  {/* 圆形背景 */}
                  <circle
                    cx={shape.x + shape.width + 5} // 圆心在矩形右边缘外 5px
                    cy={shape.y + shape.height + 5} // 圆心在矩形下边缘外 5px
                    r={12}
                    fill='#F33B40' // 圆形背景颜色
                    stroke='#F33B40' // 圆形边框颜色
                    strokeWidth='1'
                  />

                  {/* 文字 */}
                  <text
                    x={shape.x + shape.width + 5} // 文字开始于圆心x坐标
                    y={shape.y + shape.height + 5} // 文字开始于圆心y坐标
                    textAnchor="middle" // 文字水平居中
                    dominantBaseline="central" // 文字垂直居中
                    fill="#fff" // 文字填充为无色
                    stroke="#fff" // 边框颜色
                    strokeWidth="1" // 边框宽度
                    fontSize={14} // 文字大小
                  >
                    {shape.markNum}
                  </text>
                </g>

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
                {React.cloneElement(element, {
                  className: cn({ [styles.disabled]: shape.disabled }),
                })}
                {React.cloneElement(element, {
                  className: cn(styles.svgHit, { [styles.disabled]: shape.disabled }),
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
                    disabled={shape.disabled}
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
                    onChangeStart={onChangeStart}
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
                disabled={shape.disabled}
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
