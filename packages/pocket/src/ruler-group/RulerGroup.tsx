/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { useControllableProps, useThis } from '@orca-fe/hooks';
import { useEventListener, useSetState } from 'ahooks';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import cn from 'classnames';
import Ruler from './Ruler';
import useStyles from './RulerGroup.style';

export interface RulerGroupProps {

  /* 标尺尺寸 */
  size?: number;

  /* 缩放级别 */
  zoom?: number;

  /* 偏移量 */
  offsetX?: number;

  /* 偏移量 */
  offsetY?: number;

  /* 横轴辅助线 */
  xLines?: number[];
  onXLinesChange?: (lines: number[]) => void;

  /* 纵轴辅助线 */
  yLines?: number[];
  onYLinesChange?: (lines: number[]) => void;

  /* 是否展示辅助线 */
  lineVisible?: boolean;
}

const RulerGroup = (props: RulerGroupProps) => {
  const styles = useStyles();
  const [{ size = 20, offsetX = 0, offsetY = 0, zoom = 0, lineVisible, xLines, yLines }, changeProps] = useControllableProps(props, {
    /* 横轴辅助线 */
    xLines: [] as number[],

    /* 纵轴辅助线 */
    yLines: [] as number[],

    /* 是否展示辅助线 */
    lineVisible: true,
  });

  const [{ xPreview, yPreview }, setState] = useSetState({
    /* 横轴辅助线（预览） */
    xPreview: null as null | number,

    /* 纵轴辅助线（预览） */
    yPreview: null as null | number,
  });

  const _this = useThis({
    lineDragging: false as
      | false
      | {
          x: number;
          y: number;
          index: number;
          isHorizon: boolean;
          value: number;
        },
  });

  /* 横向标尺点击 */
  const handleHRulerClick = (value) => {
    if (lineVisible) {
      changeProps({
        xLines: [...xLines, value],
      });
    }
  };

  /* 纵向标尺点击 */
  const handleVRulerClick = (value) => {
    if (lineVisible) {
      changeProps({
        yLines: [...yLines, value],
      });
    }
  };

  /* 横向标尺鼠标移动 */
  const handleRulerHMouseMove = (value: number | null) => {
    setState({ xPreview: value });
  };

  /* 纵向标尺鼠标移动 */
  const handleRulerVMouseMove = (value: number | null) => {
    setState({ yPreview: value });
  };

  /* 删除辅助线 */
  const deleteLine = (e, config) => {
    const { index, isHorizon } = config;
    const newLines = (isHorizon ? xLines : yLines).filter((_, i) => i !== index);

    changeProps(isHorizon ? { xLines: newLines } : { yLines: newLines });
  };

  /* 开始拖拽辅助线 */
  const lineDragStart = (e, config) => {
    _this.lineDragging = {
      x: e.pageX,
      y: e.pageY,
      ...config,
    };
  };

  /* 全局鼠标移动 - 正在拖拽辅助线 */
  useEventListener('mousemove', (e) => {
    if (_this.lineDragging) {
      const { pageX, pageY } = e;
      const { x, y, isHorizon, index, value } = _this.lineDragging;
      const lines = (isHorizon ? xLines : yLines).slice();
      const newValue = value + (isHorizon ? pageX - x : pageY - y) / 2 ** zoom;
      lines[index] = Math.round(newValue);
      changeProps(isHorizon ? { xLines: lines } : { yLines: lines });
    }
  });

  /* 完成拖拽辅助线 */
  useEventListener('mouseup', () => {
    _this.lineDragging = false;
  });

  /* 切换辅助线隐藏/显示 */
  const handleLineVisibleClick = () => {
    changeProps({ lineVisible: !lineVisible });
  };

  /* 预览辅助线 */
  const renderLinePreview = () => {
    if (xPreview != null) {
      return (
        <div className={cn(styles.line, styles.preview)} style={{ height: '100%', left: offsetX + xPreview * 2 ** zoom }}>
          <div className={styles.lineTip}>{xPreview}</div>
        </div>
      );
    } else if (yPreview != null) {
      return (
        <div className={cn(styles.line, styles.preview)} style={{ width: '100%', top: offsetY + yPreview * 2 ** zoom }}>
          <div className={styles.lineTip}>{yPreview}</div>
        </div>
      );
    }
    return (
      <div
        className={cn(styles.line, styles.preview)}
        style={{
          width: '100%',
          top: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div className={styles.lineTip}>{yPreview}</div>
      </div>
    );
  };

  /* 渲染辅助线 */
  const renderLines = () => {
    const renderLine = (isHorizon: boolean, line: number, index: number) => {
      /* 辅助线位置需要根据zoom缩放 */
      const zoomOffset = line * 2 ** zoom;
      if ((isHorizon ? offsetX + zoomOffset : offsetY + zoomOffset) > size) {
        return (
          <div
            key={`${isHorizon ? 'H' : 'V'}_Lines_${index}`}
            onMouseDown={(e) => {
              lineDragStart(e, { isHorizon, index, value: line });
            }}
            onDoubleClick={(e) => {
              deleteLine(e, { isHorizon, index, value: line });
            }}
            className={styles.line}
            style={{
              ...(isHorizon
                ? {
                  height: '100%',
                  left: offsetX + zoomOffset,
                  cursor: 'col-resize',
                }
                : {
                  width: '100%',
                  top: offsetY + zoomOffset,
                  cursor: 'row-resize',
                }),
            }}
          >
            {/* 辅助线提示 */}
            <div
              className={styles.lineTip}
              style={{
                ...(_this.lineDragging && _this.lineDragging.index === index && _this.lineDragging.isHorizon === isHorizon
                  ? {
                    color: '#999999',
                    backgroundColor: 'rgba(0, 145, 255, 0.8)',
                  }
                  : {}),
              }}
            >
              {Math.round(line)}
            </div>
          </div>
        );
      }
      return null;
    };
    return xLines.map(renderLine.bind(null, true)).concat(yLines.map(renderLine.bind(null, false)));
  };

  return (
    <>
      {/* 横向标尺 */}
      <Ruler size={size} zoom={zoom} offsetX={offsetX} onRulerClick={handleHRulerClick} onRulerMouseMove={handleRulerHMouseMove} />
      {/* 纵向标尺 */}
      <Ruler size={size} zoom={zoom} offsetY={offsetY} orientation="vertical" onRulerClick={handleVRulerClick} onRulerMouseMove={handleRulerVMouseMove} />
      {/* 辅助线 */}
      {lineVisible && renderLines()}
      {/* 辅助线（预览） */}
      {lineVisible && renderLinePreview()}
      {/* 辅助线开关 */}
      <div className={styles.corner} style={{ width: size, height: size }} onClick={handleLineVisibleClick}>
        {lineVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
      </div>
    </>
  );
};

RulerGroup.Ruler = Ruler;

export default RulerGroup;
