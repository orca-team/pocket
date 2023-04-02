import React from 'react';
import useStyles from './ShapeRenderer.style';
import type { GraphShapeType } from '../def';

const eArr = [];

const ef = () => undefined;

export interface ShapeRendererProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  shapes?: GraphShapeType[];
  onShapeClick?: (shape: GraphShapeType, index: number) => void;
  onShapeMouseEnter?: (shape: GraphShapeType, index: number) => void;
  onShapeMouseLeave?: (shape: GraphShapeType, index: number) => void;
}

const ShapeRenderer = (props: ShapeRendererProps) => {
  const { className = '', shapes = eArr, onShapeClick = ef, onShapeMouseEnter = ef, onShapeMouseLeave = ef, ...otherProps } = props;
  const styles = useStyles();
  return (
    <div className={`${styles.root} ${className}`} {...otherProps}>
      <svg className={styles.svg} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        {shapes.map((shape, index) => {
          let element: React.ReactElement | null = null;
          switch (shape.type) {
            case 'ellipse':
              element = (
                <ellipse
                  cx={shape.x + 0.5 * shape.width}
                  cy={shape.y + 0.5 * shape.height}
                  rx={0.5 * shape.width}
                  ry={0.5 * shape.height}
                  rotate={`${shape.rotate}deg`}
                  style={{
                    transformOrigin: `${shape.x}px ${shape.y}px`,
                  }}
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
                  }}
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
                  }}
                />
              );
              break;
            default:
          }
          if (element) {
            return (
              <React.Fragment key={index}>
                {element}
                {React.cloneElement(element, {
                  className: styles.svgHit,
                  onClick: () => {
                    onShapeClick(shape, index);
                  },
                  onMouseEnter: () => {
                    onShapeMouseEnter(shape, index);
                  },
                  onMouseLeave: () => {
                    onShapeMouseLeave(shape, index);
                  },
                })}
              </React.Fragment>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};

export default ShapeRenderer;
