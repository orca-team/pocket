/* eslint-disable react/no-unused-prop-types */
import type { CSSProperties } from 'react';
import React, { useContext, useImperativeHandle, useState } from 'react';
import { IconButton, Trigger } from '@orca-fe/pocket';
import type { PainterRef, ShapeDataType, ShapeType } from '@orca-fe/painter';
import Painter from '@orca-fe/painter';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { changeArr } from '@orca-fe/tools';
import produce from 'immer';
import rfdc from 'rfdc';
import { useHotkeyListener } from '@orca-fe/hooks';
import ToolbarPortal from '../../ToolbarPortal';
import { IconAddShape } from '../../icon/icon';
import ToolbarButton from '../../ToolbarButton';
import PDFViewerContext, { usePageCoverRenderer } from '../../context';
import SimplePropsEditor from '../SimplePropsEditor';
import PopupBox from '../PopupBox';
import type { PropsType } from '../SimplePropsEditor/def';
import useStyle from './PDFMarkPlugin.style';
import { useLocale } from '../../locale/context';
import zhCN from '../../locale/zh_CN';

const deepClone = rfdc();

export type PDFMarkPluginHandle = {

  /** 开始绘图 */
  drawMark: (shapeType: ShapeType, attr: Record<string, any>) => void;

  /** 取消绘图 */
  cancelDraw: () => void;
};

const eArr = [];

const ef = () => { };

/**
 * PDFMarkPlugin 标注插件属性
 */
export interface PDFMarkPluginProps {

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

  /** 是否展示绘图下拉弹出窗 */
  popupVisible?: boolean;

  /** 是否展示绘图按钮 */
  drawingVisible?: boolean;

  /** 插件实例ID */
  drawingPluginId?: string;

  /** 按钮名称 */
  buttonName?: string;
}

type PainterRefType = {
  refs: (PainterRef | null)[];
};

const drawingNamePDFPainterPlugin = 'PDFMarkPlugin';

/**
 * PDFMarkPlugin 标注插件
 */
const PDFMarkPlugin = React.forwardRef<PDFMarkPluginHandle, PDFMarkPluginProps>((props, pRef) => {
  const [l] = useLocale(zhCN);
  const { disabledButton, autoCheck = true, onChangeStart = ef, buttonName = l.paint, drawingVisible = true, drawingPluginId = drawingNamePDFPainterPlugin } = props;
  const styles = useStyle();

  const { internalState, setInternalState } = useContext(PDFViewerContext);

  const propsDef: PropsType[] = [
    {
      key: 'stroke',
      type: 'color',
      name: l.color,
    },
    {
      key: 'strokeWidth',
      type: 'number',
      min: 0.1,
      max: 20,
      step: 0.1,
      name: l.border,
    },
  ];

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
  const drawing = internalState.drawingPluginName === drawingPluginId;

  const setDrawing = useMemoizedFn((b: boolean) => {
    setInternalState({ // 这里设置的时候，已经是全局的了
      drawingPluginName: b ? drawingPluginId : '',
    });
  });

  const [drawMode, setDrawMode] = useState<{
    shapeType: ShapeType;
    attr?: Record<string, any>;
  }>({
    shapeType: 'mark',
  });

  const [_painter] = useState<PainterRefType>({
    refs: [],
  });

  useHotkeyListener('Escape', () => {
    if (checked) {
      setChecked(undefined);
      return false;
    }
    if (drawing) {
      setDrawing(false);
      return false;
    }
    return true;
  });

  const renderPageCover = usePageCoverRenderer();

  const drawMark = useMemoizedFn<PDFMarkPluginHandle['drawMark']>((shapeType, attr) => {
    setDrawMode({
      attr,
      shapeType,
    });
    if (!drawing) {
      setDrawing(true);
    }
  });
  const cancelDraw = useMemoizedFn<PDFMarkPluginHandle['cancelDraw']>(() => {
    setDrawing(false);
  });

  useImperativeHandle(pRef, () => ({
    drawMark,
    cancelDraw,
  }));

  return (
    <>
      {!disabledButton && (
        <ToolbarPortal>
          <div className={styles.root} style={{ display: drawingVisible ? 'block' : 'none' }}>
            <span className={styles.root}>
              <ToolbarButton
                checked={drawing}
                onClick={(e) => {
                  if (drawing) {
                    setDrawing(false);
                  } else {

                    drawMark(
                      drawMode.shapeType || 'mark',
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
          </div>
        </ToolbarPortal>
      )}
      {renderPageCover((pageIndex, { viewport, zoom }) => (
        <Painter
          ref={ref => (_painter.refs[pageIndex] = ref)}
          autoCheck={autoCheck}
          draggable={false}
          className={`${styles.painter} ${drawing ? styles.drawing : ''}`}
          style={
            {
              height: '100%',
              '--painter-scale': 'var(--scale-factor-origin, 1)',
              '--transformer-layout-scale': 'var(--scale-factor-origin, 1)',
            } as CSSProperties
          }
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
          dataList={dataList}
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
          renderTransformingRect={(shape, index) => {
            // 是否圖片類型
            const isImage = shape.type === 'image';
            const deleteButton = (
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
            );
            const shapePopup = (
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
                            if (shape.type === 'mark') {
                              shape.x += offset;
                              shape.y += offset;
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
                  {deleteButton}
                </div>
              </PopupBox>
            );

            return (
              <Trigger
                popupVisible={!shape.disabled}
                getPopupContainer={dom => dom}
                popupAlign={{
                  points: isImage ? ['tl', 'tr'] : ['bl', 'tl'],
                  offset: isImage ? [5, -5] : [0, -5],
                }}
                popup={shapePopup}
              >
                <div style={{ position: 'absolute', width: '100%', height: '100%' }} />
              </Trigger>
            );
          }}
        />
      ))}
    </>
  );
});

export default PDFMarkPlugin;
