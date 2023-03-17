import React, { useRef, useState } from 'react';
import { EditableDiv } from '@orca-fe/pocket';
import cn from 'classnames';
import { usePan } from '@orca-fe/hooks';
import useStyles from './PDFTooltip.style';
import type { TooltipDataType } from '../def';

const ef = () => {};

export interface PDFTooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  data: TooltipDataType;
  onChange?: (data: TooltipDataType) => void;
  editable?: boolean;
  pointMapping?: (point: { x: number; y: number }) => { x: number; y: number };
}

const PDFTooltip = (props: PDFTooltipProps) => {
  const {
    className = '',
    onChange = ef,
    data: _data,
    style,
    editable = false,
    pointMapping = a => a,
    ...otherProps
  } = props;
  const styles = useStyles();

  const isLeft = _data.pointX < _data.x + 0.5 * _data.width;

  const boxRef = useRef<HTMLDivElement>(null);
  const moveHandlerRef = useRef<HTMLDivElement>(null);
  const widthHandlerRef = useRef<HTMLDivElement>(null);

  const [tmpData, setTmpData] = useState<Partial<TooltipDataType> | null>(null);
  const data = {
    ..._data,
    ...tmpData,
  };

  const pointX = data.pointX - data.x;
  const pointY = data.pointY - data.y;

  const [editing, setEditing] = useState(false);

  usePan(({ offset, finish, target, start, ev }) => {
    if (start) {
      if (boxRef.current?.contains(target) && editing) {
        return false;
      }
    }
    const realOffset = pointMapping({
      x: offset[0],
      y: offset[1],
    });
    if (finish) {
      setTmpData(null);
      onChange({
        ..._data,
        x: _data.x + realOffset.x,
        y: _data.y + realOffset.y,
      });
    } else {
      setTmpData({
        x: _data.x + realOffset.x,
        y: _data.y + realOffset.y,
      });
    }
    return true;
  }, boxRef);

  usePan(({ offset, finish }) => {
    const realOffset = pointMapping({
      x: offset[0],
      y: offset[1],
    });
    if (finish) {
      setTmpData(null);
      onChange({
        ..._data,
        pointX: _data.pointX + realOffset.x,
        pointY: _data.pointY + realOffset.y,
      });
    } else {
      setTmpData({
        pointX: _data.pointX + realOffset.x,
        pointY: _data.pointY + realOffset.y,
      });
    }
  }, moveHandlerRef);

  usePan(({ offset, finish }) => {
    const realOffset = pointMapping({
      x: offset[0],
      y: offset[1],
    });
    let widthOffset = realOffset.x;
    if (isLeft) {
      widthOffset = Math.max(-_data.width + 40, widthOffset);
    } else {
      widthOffset = Math.max(_data.width - 40, widthOffset);
    }
    const tmpData: Partial<TooltipDataType> = isLeft
      ? {
        width: _data.width + widthOffset,
      }
      : {
        x: _data.x + widthOffset,
        width: _data.width - widthOffset,
      };
    if (finish) {
      setTmpData(null);
      onChange({
        ..._data,
        ...tmpData,
      });
    } else {
      setTmpData(tmpData);
    }
  }, widthHandlerRef);

  return (
    <div
      className={cn(styles.root, { [styles.editable]: editable }, className)}
      style={{
        ...style,
        left: `calc(var(--scale-factor) * ${data.x}px)`,
        top: `calc(var(--scale-factor) * ${data.y}px)`,
        width: data.width,
        transform: 'scale(var(--scale-factor))',
        transformOrigin: '0 0',
      }}
      {...otherProps}
    >
      <svg
        className={styles.svg}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ width: data.width }}
      >
        <path
          d={(isLeft
            ? ['M 0 10', 'l -8 0', `L ${pointX} ${pointY}`]
            : [`M ${data.width} 10`, 'l 8 0', `L ${pointX} ${pointY}`]
          ).join(' ')}
          style={{
            fill: 'none',
            stroke: 'transparent',
            strokeWidth: 4,
          }}
        />
        <path
          d={(isLeft
            ? ['M 0 10', 'l -8 0', `L ${pointX} ${pointY}`]
            : [`M ${data.width} 10`, 'l 8 0', `L ${pointX} ${pointY}`]
          ).join(' ')}
          style={{
            fill: 'none',
          }}
        />
        <circle cx={pointX} cy={pointY} r={2} />
      </svg>
      <div ref={boxRef} className={styles.box}>
        <EditableDiv
          transparent
          editing={editing}
          onEditChange={(editing) => {
            setEditing(editable && editing);
          }}
          value={data.value}
          onChange={(value) => {
            onChange({
              ..._data,
              value,
            });
          }}
        />
      </div>
      <div
        ref={widthHandlerRef}
        className={`${styles.dragHandler} ${styles.widthResizer}`}
        style={{ left: isLeft ? '100%' : 0, top: '50%' }}
      />
      <div
        ref={moveHandlerRef}
        className={`${styles.dragHandler} ${styles.pointResizer}`}
        style={{ left: pointX, top: pointY }}
      />
    </div>
  );
};

export default PDFTooltip;
