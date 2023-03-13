import React from 'react';
import { IconButton, SimpleNumberInput } from '@orca-fe/pocket';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import Trigger from 'rc-trigger';
import type { ShapeType } from '@orca-fe/painter';
import { ColorPicker } from '@orca-fe/painter';
import useStyle from './PainterToolbar.style';
import ToolbarPortal from '../ToolbarPortal';
import {
  IconEllipse,
  IconLine,
  IconRectangle,
  IconSmoothLine,
} from '../icon/icon';

const ef = () => undefined;

type DrawMode = { shapeType: ShapeType; attr?: Record<string, any> };

export interface PainterToolbarProps {
  drawing?: boolean;
  drawMode?: DrawMode;
  onDrawModeChange?: (shapeType: ShapeType, attr: Record<string, any>) => void;
  onDrawCancel?: () => void;
}

const defaultDrawMode: DrawMode = {
  shapeType: 'rectangle',
};

const PainterToolbar = (props: PainterToolbarProps) => {
  const {
    drawMode = defaultDrawMode,
    onDrawModeChange = ef,
    onDrawCancel = ef,
    drawing,
  } = props;
  const styles = useStyle();

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
          onDrawModeChange('line', drawMode.attr || {});
        }}
      >
        <IconLine />
      </IconButton>
      <IconButton
        checked={shapeType === 'line-path'}
        onClick={() => {
          onDrawModeChange('line-path', drawMode.attr || {});
        }}
      >
        <IconSmoothLine />
      </IconButton>
      <IconButton
        checked={shapeType === 'rectangle'}
        onClick={() => {
          onDrawModeChange('rectangle', drawMode.attr || {});
        }}
      >
        <IconRectangle />
      </IconButton>
      <IconButton
        checked={shapeType === 'ellipse'}
        onClick={() => {
          onDrawModeChange('ellipse', drawMode.attr || {});
        }}
      >
        <IconEllipse />
      </IconButton>
      <ColorPicker
        value={stroke}
        onChange={(stroke) => {
          onDrawModeChange(drawMode.shapeType, {
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
          onDrawModeChange(drawMode.shapeType, {
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
          onDrawCancel();
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
          action={['click']}
          popupVisible={drawing}
          destroyPopupOnHide
          popupAlign={{
            points: ['tr', 'br'],
            offset: [0, 3],
          }}
          popupTransitionName="rc-trigger-popup-zoom"
          popupClassName={styles.wrapper}
          popup={renderPainterToolbar()}
        >
          <span className={styles.root}>
            <IconButton
              checked={drawing}
              onClick={(e) => {
                if (drawing) {
                  onDrawCancel();
                } else {
                  onDrawModeChange(
                    drawMode.shapeType || 'rectangle',
                    drawMode.attr || {
                      strokeWidth: 1,
                      stroke: '#CC0000',
                    },
                  );
                }
              }}
            >
              <EditOutlined />
            </IconButton>
          </span>
        </Trigger>
      </div>
    </ToolbarPortal>
  );
};

export default PainterToolbar;
