import React, { useContext, useEffect, useImperativeHandle, useState } from 'react';
import { IconButton, Trigger } from '@orca-fe/pocket';
import type { PainterProps, PainterRef, ShapeDataType, ShapeType } from '@orca-fe/painter';
import Painter from '@orca-fe/painter';
import { useMemoizedFn } from 'ahooks';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import useStyle from './PDFPainterPlugin.style';
import ToolbarPortal from '../../ToolbarPortal';
import { IconAddShape, IconEllipse, IconFreedom, IconLine, IconRectangle } from '../../icon/icon';
import ToolbarButton from '../../ToolbarButton';
import PDFViewerContext, { usePageCoverRenderer } from '../../context';
import SimplePropsEditor from '../SimplePropsEditor';
import PopupBox from '../PopupBox';
import type { PropsType } from '../SimplePropsEditor/def';

export type PDFPainterPluginHandle = {

  /** 获取所有标注内容 */
  getAllMarkData: () => ShapeDataType[][];

  /** 设置某一页的标注内容 */
  setMarkData: (page: number, markData: ShapeDataType[]) => void;

  /** 设置所有页面的标注内容 */
  setAllMarkData: (markData: ShapeDataType[][]) => void;

  /** 清除所有页面的标注内容 */
  clearAllMarkData: () => void;

  /** 开始绘图 */
  drawMark: (shapeType: ShapeType, attr: Record<string, any>) => void;

  /** 取消绘图 */
  cancelDraw: () => void;

  /** 取消所有选中 */
  cancelCheck: () => void;
};

const ef = () => undefined;

const propsDef: PropsType[] = [
  {
    key: 'stroke',
    type: 'color',
    name: '颜色',
  },
  {
    key: 'strokeWidth',
    type: 'number',
    min: 0.1,
    max: 20,
    step: 0.1,
    name: '边框',
  },
];

export interface PDFPainterPluginProps {

  /** 标注内容变化事件 */
  onMarkChange?: (page: number, markData: ShapeDataType[]) => void;

  onCheck?: PainterProps['onCheck'];
}

type PainterRefType = {
  refs: (PainterRef | null)[];
  // 绘图数据
  data: ShapeDataType[][];
};
const PDFPainterPlugin = React.forwardRef<PDFPainterPluginHandle, PDFPainterPluginProps>((props, pRef) => {
  const { onMarkChange = ef, onCheck } = props;
  const styles = useStyle();

  /* 绘图功能 */
  const [drawing, setDrawing] = useState(false);

  const [drawMode, setDrawMode] = useState<{
    shapeType: ShapeType;
    attr?: Record<string, any>;
  }>({
    shapeType: 'rectangle',
  });

  const [_painter] = useState<PainterRefType>({
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

  const getAllMarkData = useMemoizedFn<PDFPainterPluginHandle['getAllMarkData']>(() => _painter.data);
  const setMarkData = useMemoizedFn<PDFPainterPluginHandle['setMarkData']>((pageIndex, data) => {
    const ref = _painter.refs[pageIndex];
    if (ref) {
      ref.clearShapes();
      ref.addShapes(data);
    }
    _painter.data[pageIndex] = data;
  });
  const clearAllMarkData = useMemoizedFn<PDFPainterPluginHandle['clearAllMarkData']>(() => {
    _painter.refs.forEach((ref, pageIndex) => {
      if (ref) {
        ref.clearShapes();
      }
    });
  });
  const setAllMarkData = useMemoizedFn<PDFPainterPluginHandle['setAllMarkData']>((shapeDataList) => {
    clearAllMarkData();
    shapeDataList.forEach((shapeData, pageIndex) => {
      setMarkData(pageIndex, shapeData);
    });
  });

  const renderPageCover = usePageCoverRenderer();

  const { pdfViewer } = useContext(PDFViewerContext);

  const drawMark = useMemoizedFn<PDFPainterPluginHandle['drawMark']>((shapeType, attr) => {
    setDrawMode({
      attr,
      shapeType,
    });
    if (!drawing) {
      pdfViewer.cancelDraw();
      setDrawing(true);
    }
  });
  const cancelDraw = useMemoizedFn<PDFPainterPluginHandle['cancelDraw']>(() => {
    setDrawing(false);
  });
  const cancelCheck = useMemoizedFn<PDFPainterPluginHandle['cancelCheck']>(() => {
    _painter.refs.forEach((painter) => {
      if (painter) {
        painter.unCheck();
      }
    });
  });

  useImperativeHandle(pRef, () => ({
    clearAllMarkData,
    getAllMarkData,
    setMarkData,
    setAllMarkData,
    drawMark,
    cancelDraw,
    cancelCheck,
  }));

  // let stroke = '#cc0000';
  // let strokeWidth = 2;
  let shapeType: ShapeType = 'rectangle';
  // if (drawMode.attr?.['stroke']) {
  //   ({ stroke } = drawMode.attr);
  // }
  // if (drawMode.attr?.['strokeWidth']) {
  //   strokeWidth = Number(drawMode.attr.strokeWidth) || 2;
  // }
  ({ shapeType } = drawMode);

  const renderPainterToolbar = () => (
    <div className={styles.toolbar}>
      <IconButton
        checked={shapeType === 'line'}
        onClick={() => {
          drawMark('line', drawMode.attr || {});
        }}
      >
        <IconLine />
      </IconButton>
      <IconButton
        checked={shapeType === 'line-path'}
        onClick={() => {
          drawMark('line-path', drawMode.attr || {});
        }}
      >
        <IconFreedom />
      </IconButton>
      <IconButton
        checked={shapeType === 'rectangle'}
        onClick={() => {
          drawMark('rectangle', drawMode.attr || {});
        }}
      >
        <IconRectangle />
      </IconButton>
      <IconButton
        checked={shapeType === 'ellipse'}
        onClick={() => {
          drawMark('ellipse', drawMode.attr || {});
        }}
      >
        <IconEllipse />
      </IconButton>
    </div>
  );

  return (
    <>
      <ToolbarPortal>
        <div className={styles.root}>
          <Trigger
            action="click"
            popupVisible={drawing}
            popupAlign={{
              points: ['tr', 'br'],
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
                    drawMark(
                      drawMode.shapeType || 'rectangle',
                      drawMode.attr || {
                        strokeWidth: 1,
                        stroke: '#CC0000',
                      },
                    );
                  }
                }}
                icon={<IconAddShape />}
              >
                绘图
              </ToolbarButton>
            </span>
          </Trigger>
        </div>
      </ToolbarPortal>
      {renderPageCover((pageIndex, { viewport, zoom }) => (
        <Painter
          ref={ref => (_painter.refs[pageIndex] = ref)}
          draggable={false}
          className={`${styles.painter} ${drawing ? styles.drawing : ''}`}
          width={viewport.width}
          height={viewport.height}
          style={{ height: '100%' }}
          defaultDrawMode={drawing ? drawMode : false}
          onInit={() => {
            const shapeData = _painter.data[pageIndex];
            const ref = _painter.refs[pageIndex];
            if (shapeData && ref) {
              // 恢复数据
              ref.addShapes(shapeData);

              if (drawing) {
                // 进入绘图模式
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
          onDraw={() => {
            setDrawing(false);
          }}
          onCheck={onCheck}
          renderTransformingRect={(indexList, shapes, painter) => (
            <Trigger
              popupVisible
              getPopupContainer={dom => dom}
              popupAlign={{
                points: ['bl', 'tl'],
                offset: [0, -5],
              }}
              popup={(
                <PopupBox style={{ pointerEvents: 'initial' }}>
                  <SimplePropsEditor
                    value={{
                      stroke: shapes[0]['stroke'],
                      strokeWidth: shapes[0]['strokeWidth'],
                    }}
                    propsDef={propsDef}
                    onChange={(newProps) => {
                      indexList.forEach((i) => {
                        painter.updateShape(i, newProps);
                      });
                    }}
                    colorTriggerProps={{
                      getPopupContainer: () => _painter.refs[pageIndex]?.getRoot() ?? document.body,
                      popupAlign: {
                        overflow: {
                          adjustY: false,
                        },
                      },
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => {
                        painter.addShapes(shapes);
                      }}
                      style={{ color: '#333' }}
                    >
                      <CopyOutlined />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        indexList
                          .slice()
                          .sort((a, b) => b - a)
                          .forEach((i) => {
                            painter.removeShape(i);
                          });
                      }}
                      style={{ color: '#C00' }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </div>
                </PopupBox>
              )}
            >
              <div style={{ width: '100%', height: '100%' }} />
            </Trigger>
          )}
        />
      ))}
    </>
  );
});

export default PDFPainterPlugin;
