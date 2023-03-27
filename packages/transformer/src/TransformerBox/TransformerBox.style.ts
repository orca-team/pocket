import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'orca-transformer-box';

export default createUseStyles(
  {
    root: {
      position: 'absolute',
      userSelect: 'none',
      width: 100,
      height: 150,
      border: '1px solid rgba(0, 129, 255, 0)',
      transformOrigin: 'left top',
      '--transformer-box-scale': 'var(--transformer-layout-scale, 1)',
      '&:hover': {
        border: '1px solid #66ccff',
      },
      '&$statusChecked': {
        '&, &:hover': {
          border: '1px solid #1199ff',
        },
      },
    },
    statusDisabled: {
      pointerEvents: 'none',
    },
    statusChecked: {
      '&, &:hover': {
        zIndex: 1,
      },

      '& $scaleHandle': {
        visibility: 'visible',
      },
    },
    scaleHandle: {
      width: 8,
      height: 8,
      border: '1px solid #0081ff',
      backgroundColor: 'white',
      transform: 'translate(-50%, -50%)',
      position: 'absolute',
      visibility: 'hidden',
    },
    rotateHandle: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      left: '50%',
      top: -32,
      cursor: 'move',
    },
    scaleHandleCenter: {
      top: '50%',
      left: '50%',
      borderRadius: '50%',
    },
    scaleHandleTop: {
      top: 0,
      left: '50%',
    },
    scaleHandleBottom: {
      top: '100%',
      left: '50%',
    },
    scaleHandleLeft: {
      top: '50%',
      left: 0,
    },
    scaleHandleRight: {
      top: '50%',
      left: '100%',
    },
    scaleHandleTopLeft: {
      top: 0,
      left: 0,
    },
    scaleHandleTopRight: {
      top: 0,
      left: '100%',
    },
    scaleHandleBottomLeft: {
      top: '100%',
      left: 0,
    },
    scaleHandleBottomRight: {
      top: '100%',
      left: '100%',
    },
    cursor0: {
      cursor: 'ns-resize',
    },
    cursor1: {
      cursor: 'nesw-resize',
    },
    cursor2: {
      cursor: 'ew-resize',
    },
    cursor3: {
      cursor: 'nwse-resize',
    },
    content: {
      '--transformer-box-scale': 'var(--transformer-layout-scale, 1)',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      transformOrigin: 'top left',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
