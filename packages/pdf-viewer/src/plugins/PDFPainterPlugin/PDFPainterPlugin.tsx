/* eslint-disable react/no-unused-prop-types */
import React, { useContext, useImperativeHandle, useState } from 'react';
import { IconButton, Trigger } from '@orca-fe/pocket';
import type { PainterRef, ShapeDataType, ShapeType } from '@orca-fe/painter';
import Painter from '@orca-fe/painter';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { changeArr } from '@orca-fe/tools';
import produce from 'immer';
import rfdc from 'rfdc';
import ToolbarPortal from '../../ToolbarPortal';
import { IconAddShape, IconEllipse, IconFreedom, IconLine, IconRectangle } from '../../icon/icon';
import ToolbarButton from '../../ToolbarButton';
import PDFViewerContext, { usePageCoverRenderer } from '../../context';
import SimplePropsEditor from '../SimplePropsEditor';
import PopupBox from '../PopupBox';
import type { PropsType } from '../SimplePropsEditor/def';
import useStyle from './PDFPainterPlugin.style';

const deepClone = rfdc();

export type { PainterRef, ShapeDataType, ShapeType };

export type PDFPainterPluginHandle = {

  /** 开始绘图 */
  drawMark: (shapeType: ShapeType, attr: Record<string, any>) => void;

  /** 取消绘图 */
  cancelDraw: () => void;
};

const eArr = [];

const ef = () => {};

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

/**
 * PDFPainterPlugin 绘图插件属性
 */
export interface PDFPainterPluginProps {

  /** 默认选中的区域 */
  defaultChecked?: [number, number];

  /** 选中的区域 */
  checked?: [number, number];

  /** 选中区域变化时的回调函数 */
  onCheck?: (checked: [number, number]) => void;

  /** 默认的绘图数据 */
  defaultData?: ShapeDataType[][];

  /** 绘图数据 */
  data?: ShapeDataType[][];

  /** 绘图数据变化时的回调函数 */
  onDataChange?: (data: ShapeDataType[][], action: 'add' | 'change' | 'delete', pageIndex: number, index: number) => void;

  /** 是否禁用按钮 */
  disabledButton?: boolean;

  /** 是否自动选中 */
  autoCheck?: boolean;

  /** 开始绘图时的回调函数 */
  onChangeStart?: (pageIndex: number, index: number) => void;

  buttonName?: string;
}

type PainterRefType = {
  refs: (PainterRef | null)[];
};

const drawingNamePDFPainterPlugin = 'PDFPainterPlugin';

/**
 * PDFPainterPlugin 绘图插件
 */
const PDFPainterPlugin = React.forwardRef<PDFPainterPluginHandle, PDFPainterPluginProps>((props, pRef) => {
  const { disabledButton, autoCheck = true, onChangeStart = ef, buttonName = '绘图' } = props;
  const styles = useStyle();

  const { internalState, setInternalState } = useContext(PDFViewerContext);

  const [checked, setChecked] = useControllableValue<[number, number] | undefined>(props, {
    defaultValuePropName: 'defaultChecked',
    trigger: 'onCheck',
    valuePropName: 'checked',
  });

  const [dataList = eArr, setDataList] = useControllableValue<ShapeDataType[][]>(props, {
    defaultValuePropName: 'defaultData',
    trigger: 'onDataChange',
    valuePropName: 'data',
  });

  /* 绘图功能 */
  const drawing = internalState.drawingPluginName === drawingNamePDFPainterPlugin;

  const setDrawing = useMemoizedFn((b: boolean) => {
    setInternalState({
      drawingPluginName: b ? drawingNamePDFPainterPlugin : '',
    });
  });

  const [drawMode, setDrawMode] = useState<{
    shapeType: ShapeType;
    attr?: Record<string, any>;
  }>({
    shapeType: 'rectangle',
  });

  const [_painter] = useState<PainterRefType>({
    refs: [],
  });

  const renderPageCover = usePageCoverRenderer();

  const drawMark = useMemoizedFn<PDFPainterPluginHandle['drawMark']>((shapeType, attr) => {
    setDrawMode({
      attr,
      shapeType,
    });
    if (!drawing) {
      setDrawing(true);
    }
  });
  const cancelDraw = useMemoizedFn<PDFPainterPluginHandle['cancelDraw']>(() => {
    setDrawing(false);
  });

  useImperativeHandle(pRef, () => ({
    drawMark,
    cancelDraw,
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

  // 绘图菜单栏（二级）
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
      {!disabledButton && (
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
                  {buttonName}
                </ToolbarButton>
              </span>
            </Trigger>
          </div>
        </ToolbarPortal>
      )}
      {renderPageCover((pageIndex, { viewport, zoom }) => (
        <Painter
          ref={ref => (_painter.refs[pageIndex] = ref)}
          autoCheck={autoCheck}
          draggable={false}
          className={`${styles.painter} ${drawing ? styles.drawing : ''}`}
          style={{
            height: '100%',
            '--painter-scale': 'var(--scale-factor, 1)',
            '--transformer-layout-scale': 'var(--scale-factor, 1)',
          }}
          zoom={zoom}
          defaultDrawMode={drawing ? drawMode : undefined}
          drawMode={drawing ? drawMode : undefined}
          onChangeStart={(index) => {
            onChangeStart(pageIndex, index);
          }}
          onDrawModeChange={(drawMode) => {
            if (drawMode) {
              setDrawMode(drawMode);
            } else {
              setDrawing(false);
            }
          }}
          data={dataList[pageIndex] || eArr}
          onDataChange={(pageData, action, index) => {
            setDataList(changeArr(dataList, pageIndex, pageData), action, pageIndex, index);
          }}
          checked={checked?.[0] === pageIndex ? checked[1] : undefined}
          onCheck={(index) => {
            setChecked((checked) => {
              if (index >= 0) {
                return [pageIndex, index];
              }
              if (checked && checked[0] !== pageIndex) {
                return checked;
              }
              return undefined;
            });
          }}
          renderTransformingRect={(shape, index) => (
            <Trigger
              popupVisible={!shape.disabled}
              getPopupContainer={dom => dom}
              popupAlign={{
                points: ['bl', 'tl'],
                offset: [0, -5],
              }}
              popup={(
                <PopupBox
                  style={{ pointerEvents: 'initial' }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <SimplePropsEditor
                    value={{
                      stroke: shape['stroke'],
                      strokeWidth: shape['strokeWidth'],
                    }}
                    propsDef={propsDef}
                    onChange={(newProps) => {
                      const newShape = {
                        ...shape,
                        ...newProps,
                      };
                      setDataList(
                        produce(dataList, (_dataList) => {
                          if (_dataList[pageIndex]) {
                            // eslint-disable-next-line no-param-reassign
                            _dataList[pageIndex][index] = newShape;
                          }
                        }),
                        'change',
                        pageIndex,
                        index,
                      );
                    }}
                    colorTriggerProps={{
                      getPopupContainer: () => _painter.refs[pageIndex]?.getRoot() ?? document.body,
                      popupAlign: {
                        overflow: {
                          adjustY: true,
                          shiftX: true,
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
                        // 复制
                        setDataList(
                          produce(dataList, (_dataList) => {
                            if (_dataList[pageIndex]) {
                              // eslint-disable-next-line no-param-reassign
                              const shape = deepClone(_dataList[pageIndex][index]);
                              const offset = 16;
                              switch (shape.type) {
                                case 'line':
                                  shape.point1 = shape.point1.map(v => v + offset) as typeof shape.point1;
                                  shape.point2 = shape.point2.map(v => v + offset) as typeof shape.point2;
                                  break;
                                case 'line-path':
                                  shape.points = shape.points.map(p => [p[0] + offset, p[1] + offset]);
                                  break;
                                case 'ellipse':
                                case 'rectangle':
                                  shape.x += offset;
                                  shape.y += offset;
                                  break;
                              }
                              _dataList[pageIndex].push(shape);
                            }
                          }),
                          'add',
                          pageIndex,
                          dataList[pageIndex].length,
                        );

                        setChecked([pageIndex, dataList[pageIndex].length]);
                      }}
                      style={{ color: '#333' }}
                    >
                      <CopyOutlined />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        // 删除
                        setDataList(
                          produce(dataList, (_dataList) => {
                            if (_dataList[pageIndex]) {
                              // eslint-disable-next-line no-param-reassign
                              _dataList[pageIndex].splice(index, 1);
                            }
                          }),
                          'delete',
                          pageIndex,
                          index,
                        );
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
