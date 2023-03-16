import React, { useEffect, useImperativeHandle, useState } from 'react';
import { IconButton, SimpleNumberInput, Trigger } from '@orca-fe/pocket';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import type { ShapeType, PainterRef, ShapeDataType } from '@orca-fe/painter';
import Painter, { ColorPicker } from '@orca-fe/painter';
import { useMemoizedFn } from 'ahooks';
import useStyle from './PDFPainterPlugin.style';
import ToolbarPortal from '../ToolbarPortal';
import {
  IconEllipse,
  IconLine,
  IconRectangle,
  IconSmoothLine,
} from '../icon/icon';
import ToolbarButton from '../ToolbarButton';
import { usePageCoverRenderer } from '../context';

export type PDFPainterHandle = {
  /** 获取所有标注内容 */
  getAllMarkData: () => ShapeDataType[][];

  /** 设置某一页的标注内容 */
  setMarkData: (page: number, markData: ShapeDataType[]) => void;

  /** 设置所有页面的标注内容 */
  setAllMarkData: (markData: ShapeDataType[][]) => void;

  /** 清除所有页面的标注内容 */
  clearAllMarkData: () => void;
};

const ef = () => undefined;

export interface PainterToolbarProps {
  /** 标注内容变化事件 */
  onMarkChange?: (page: number, markData: ShapeDataType[]) => void;
}

const PDFPainterPlugin = React.forwardRef<
  PDFPainterHandle,
  PainterToolbarProps
>((props, pRef) => {
  const { onMarkChange = ef } = props;
  const styles = useStyle();

  /* 绘图功能 */
  const [drawing, setDrawing] = useState(false);

  const [drawMode, setDrawMode] = useState<{
    shapeType: ShapeType;
    attr?: Record<string, any>;
  }>({
    shapeType: 'rectangle',
  });

  const [_painter] = useState<{
    refs: (PainterRef | null)[];
    // 绘图数据
    data: ShapeDataType[][];
  }>({
    refs: [],
    data: [],
  });

  useEffect(() => {
    _painter.refs.forEach((painter) => {
      if (painter) {
        if (drawing) {
          painter.draw(drawMode.shapeType, drawMode.attr);
        } else {
          painter.cancelDraw();
        }
      }
    });
  }, [drawing, drawMode]);

  const getAllMarkData = useMemoizedFn<PDFPainterHandle['getAllMarkData']>(
    () => _painter.data,
  );
  const setMarkData = useMemoizedFn<PDFPainterHandle['setMarkData']>(
    (pageIndex, data) => {
      const ref = _painter.refs[pageIndex];
      if (ref) {
        ref.clearShapes();
        ref.addShapes(data);
      }
      _painter.data[pageIndex] = data;
    },
  );
  const clearAllMarkData = useMemoizedFn<PDFPainterHandle['clearAllMarkData']>(
    () => {
      _painter.refs.forEach((ref, pageIndex) => {
        if (ref) {
          ref.clearShapes();
        }
      });
    },
  );
  const setAllMarkData = useMemoizedFn<PDFPainterHandle['setAllMarkData']>(
    (shapeDataList) => {
      clearAllMarkData();
      shapeDataList.forEach((shapeData, pageIndex) => {
        setMarkData(pageIndex, shapeData);
      });
    },
  );

  useImperativeHandle(pRef, () => ({
    clearAllMarkData,
    getAllMarkData,
    setMarkData,
    setAllMarkData,
  }));

  usePageCoverRenderer((pageIndex, { viewport }) => (
    <Painter
      ref={(ref) => (_painter.refs[pageIndex] = ref)}
      className={`${styles.painter} ${drawing ? styles.drawing : ''}`}
      width={viewport.width}
      height={viewport.height}
      style={{ height: '100%' }}
      defaultDrawMode={drawing ? drawMode : false}
      onInit={() => {
        const shapeData = _painter.data[pageIndex];
        const ref = _painter.refs[pageIndex];
        if (shapeData && ref) {
          ref.addShapes(shapeData);
          if (drawing) {
            ref.draw(drawMode.shapeType, drawMode.attr);
          }
        }
      }}
      onDataChange={() => {
        const ref = _painter.refs[pageIndex];
        if (ref) {
          const shapes = ref.getShapes();
          _painter.data[pageIndex] = shapes;
          onMarkChange(pageIndex, shapes);
        }
      }}
    />
  ));

  const changeDrawMode = (shapeType: ShapeType, attr: Record<string, any>) => {
    setDrawMode({
      attr,
      shapeType,
    });
    if (!drawing) {
      setDrawing(true);
    }
  };

  let stroke = '#cc0000';
  let strokeWidth = 2;
  let shapeType: ShapeType = 'rectangle';
  if (drawMode.attr?.['stroke']) {
    ({ stroke } = drawMode.attr);
  }
  if (drawMode.attr?.['strokeWidth']) {
    strokeWidth = Number(drawMode.attr.strokeWidth) || 2;
  }
  ({ shapeType } = drawMode);

  const renderPainterToolbar = () => (
    <div className={styles.toolbar}>
      <IconButton
        checked={shapeType === 'line'}
        onClick={() => {
          changeDrawMode('line', drawMode.attr || {});
        }}
      >
        <IconLine />
      </IconButton>
      <IconButton
        checked={shapeType === 'line-path'}
        onClick={() => {
          changeDrawMode('line-path', drawMode.attr || {});
        }}
      >
        <IconSmoothLine />
      </IconButton>
      <IconButton
        checked={shapeType === 'rectangle'}
        onClick={() => {
          changeDrawMode('rectangle', drawMode.attr || {});
        }}
      >
        <IconRectangle />
      </IconButton>
      <IconButton
        checked={shapeType === 'ellipse'}
        onClick={() => {
          changeDrawMode('ellipse', drawMode.attr || {});
        }}
      >
        <IconEllipse />
      </IconButton>
      <ColorPicker
        value={stroke}
        onChange={(stroke) => {
          changeDrawMode(drawMode.shapeType, {
            ...drawMode.attr,
            stroke,
          });
        }}
        size={20}
      />
      <SimpleNumberInput
        triggerOnDrag={false}
        value={strokeWidth}
        onChange={(strokeWidth) => {
          changeDrawMode(drawMode.shapeType, {
            ...drawMode.attr,
            strokeWidth,
          });
        }}
        min={0.1}
        max={20}
        step={0.1}
        style={{ width: 32, textAlign: 'center' }}
      />
      <IconButton
        onClick={() => {
          setDrawing(false);
        }}
      >
        <CloseOutlined />
      </IconButton>
    </div>
  );

  return (
    <ToolbarPortal>
      <div className={styles.root}>
        <Trigger
          action="click"
          popupVisible={drawing}
          popupAlign={{
            points: ['tc', 'bc'],
            offset: [0, 3],
          }}
          popup={renderPainterToolbar()}
        >
          <span className={styles.root}>
            <ToolbarButton
              checked={drawing}
              onClick={(e) => {
                if (drawing) {
                  setDrawing(false);
                } else {
                  changeDrawMode(
                    drawMode.shapeType || 'rectangle',
                    drawMode.attr || {
                      strokeWidth: 1,
                      stroke: '#CC0000',
                    },
                  );
                }
              }}
              icon={<EditOutlined />}
            >
              编辑标注
            </ToolbarButton>
          </span>
        </Trigger>
      </div>
    </ToolbarPortal>
  );
});

export default PDFPainterPlugin;
