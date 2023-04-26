import React, { useRef, useState } from 'react';
import { EditableDiv } from '@orca-fe/pocket';
import cn from 'classnames';
import { usePan } from '@orca-fe/hooks';
import type { TooltipDataType } from '../def';
import useStyles from './PDFTooltip.style';

const ef = () => {};

const { round } = Math;

export interface PDFTooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  data: TooltipDataType;
  onChange?: (data: TooltipDataType) => void;
  onChangeStart?: () => void;
  editable?: boolean;
  pointMapping?: (point: { x: number; y: number }) => { x: number; y: number };
  color?: string;
  disabled?: boolean;
}

const PDFTooltip = (props: PDFTooltipProps) => {
  const {
    className = '',
    onChange = ef,
    onChangeStart = ef,
    data: _data,
    style,
    editable = false,
    pointMapping = a => a,
    color = '#C00',
    disabled,
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
      onChangeStart();
    }
    const realOffset = pointMapping({
      x: offset[0],
      y: offset[1],
    });
    if (finish) {
      setTmpData(null);
      onChange({
        ..._data,
        x: round(_data.x + realOffset.x),
        y: round(_data.y + realOffset.y),
      });
    } else {
      setTmpData({
        x: round(_data.x + realOffset.x),
        y: round(_data.y + realOffset.y),
      });
    }
    return true;
  }, boxRef);

  usePan(({ offset, finish, start }) => {
    const realOffset = pointMapping({
      x: offset[0],
      y: offset[1],
    });
    if (start) {
      onChangeStart();
    }
    if (finish) {
      setTmpData(null);
      onChange({
        ..._data,
        pointX: round(_data.pointX + realOffset.x),
        pointY: round(_data.pointY + realOffset.y),
      });
    } else {
      setTmpData({
        pointX: round(_data.pointX + realOffset.x),
        pointY: round(_data.pointY + realOffset.y),
      });
    }
  }, moveHandlerRef);

  usePan(({ offset, finish, start }) => {
    const realOffset = pointMapping({
      x: offset[0],
      y: offset[1],
    });
    if (start) {
      onChangeStart();
    }
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
      className={cn(styles.root, { [styles.editable]: editable, [styles.disabled]: disabled }, className)}
      draggable={false}
      style={{
        ...style,
        left: `calc(var(--scale-factor) * ${data.x}px)`,
        top: `calc(var(--scale-factor) * ${data.y}px)`,
        width: data.width,
        transform: 'scale(var(--scale-factor))',
        transformOrigin: '0 0',
        '--pdf-tooltip-color': color,
      }}
      {...otherProps}
    >
      <svg className={styles.svg} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ width: data.width }}>
        <path
          d={(isLeft ? ['M 0 10', 'l -16 0', `L ${pointX} ${pointY}`] : [`M ${data.width} 10`, 'l 16 0', `L ${pointX} ${pointY}`]).join(' ')}
          style={{
            fill: 'none',
            stroke: 'transparent',
            strokeWidth: 4,
          }}
        />
        <path
          d={(isLeft ? ['M 0 10', 'l -8 0', `L ${pointX} ${pointY}`] : [`M ${data.width} 10`, 'l 8 0', `L ${pointX} ${pointY}`]).join(' ')}
          style={{
            fill: 'none',
          }}
        />
        <circle cx={pointX} cy={pointY} r={2} />
      </svg>
      <div ref={boxRef} className={styles.box}>
        <EditableDiv
          className={styles.input}
          transparent
          editing={editing}
          onEditChange={(editing) => {
            setEditing(editable && editing);
          }}
          breakWord
          value={data.value}
          onChange={(value) => {
            onChange({
              ..._data,
              value,
            });
          }}
        />
      </div>
      <div ref={widthHandlerRef} className={`${styles.dragHandler} ${styles.widthResizer}`} style={{ left: isLeft ? '100%' : 0, top: '50%' }} />
      <div ref={moveHandlerRef} className={`${styles.dragHandler} ${styles.pointResizer}`} style={{ left: pointX, top: pointY }} />
    </div>
  );
};

export default PDFTooltip;
