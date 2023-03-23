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
      '&:hover': {
        border: '1px solid #66ccff',
      },
    },
    statusDisabled: {
      pointerEvents: 'none',
    },
    statusChecked: {
      '&, &:hover': {
        border: '1px solid #1199ff',
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
      cursor: 'ns-resize',
    },
    scaleHandleBottom: {
      top: '100%',
      left: '50%',
      cursor: 'ns-resize',
    },
    scaleHandleLeft: {
      top: '50%',
      left: 0,
      cursor: 'ew-resize',
    },
    scaleHandleRight: {
      top: '50%',
      left: '100%',
      cursor: 'ew-resize',
    },
    scaleHandleTopLeft: {
      top: 0,
      left: 0,
      cursor: 'nwse-resize',
    },
    scaleHandleTopRight: {
      top: 0,
      left: '100%',
      cursor: 'nesw-resize',
    },
    scaleHandleBottomLeft: {
      top: '100%',
      left: 0,
      cursor: 'nesw-resize',
    },
    scaleHandleBottomRight: {
      top: '100%',
      left: '100%',
      cursor: 'nwse-resize',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
