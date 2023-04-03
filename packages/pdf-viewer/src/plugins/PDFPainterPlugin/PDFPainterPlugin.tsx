/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { IconButton, Trigger } from '@orca-fe/pocket';
import type { PainterRef, ShapeDataType, ShapeType } from '@orca-fe/painter';
import Painter from '@orca-fe/painter';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { changeArr } from '@orca-fe/tools';
import produce from 'immer';
import useStyle from './PDFPainterPlugin.style';
import ToolbarPortal from '../../ToolbarPortal';
import { IconAddShape, IconEllipse, IconFreedom, IconLine, IconRectangle } from '../../icon/icon';
import ToolbarButton from '../../ToolbarButton';
import { usePageCoverRenderer } from '../../context';
import SimplePropsEditor from '../SimplePropsEditor';
import PopupBox from '../PopupBox';
import type { PropsType } from '../SimplePropsEditor/def';

export type PDFPainterPluginHandle = {

  /** 开始绘图 */
  drawMark: (shapeType: ShapeType, attr: Record<string, any>) => void;

  /** 取消绘图 */
  cancelDraw: () => void;
};

const eArr = [];

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
  defaultChecked?: [number, number];
  checked?: [number, number];
  onCheck?: (checked: [number, number]) => void;
  defaultData?: ShapeDataType[][];
  data?: ShapeDataType[][];
  onDataChange?: (data: ShapeDataType[][], action: 'add' | 'change' | 'delete', pageIndex: number, index: number) => void;
}

type PainterRefType = {
  refs: (PainterRef | null)[];
};

/**
 * PDFPainterPlugin 绘图插件
 */
const PDFPainterPlugin = React.forwardRef<PDFPainterPluginHandle, PDFPainterPluginProps>((props, pRef) => {
  const styles = useStyle();

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
  const [drawing, setDrawing] = useState(false);

  const [drawMode, setDrawMode] = useState<{
    shapeType: ShapeType;
    attr?: Record<string, any>;
  }>({
    shapeType: 'rectangle',
  });

  const [_painter] = useState<PainterRefType>({
    refs: [],
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
          style={{
            height: '100%',
            '--painter-scale': 'var(--scale-factor, 1)',
            '--transformer-layout-scale': 'var(--scale-factor, 1)',
          }}
          zoom={zoom}
          defaultDrawMode={drawing ? drawMode : undefined}
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
                        // 复制
                        setDataList(
                          produce(dataList, (_dataList) => {
                            if (_dataList[pageIndex]) {
                              // eslint-disable-next-line no-param-reassign
                              _dataList[pageIndex].push(_dataList[pageIndex][index]);
                            }
                          }),
                          'add',
                          pageIndex,
                          index,
                        );
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
