import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'pdf-tooltip';

export default createUseStyles(
  {
    root: {
      position: 'absolute',
      minHeight: 24,
      '--pdf-tooltip-color': '#c00',
      color: 'var(--pdf-tooltip-color)',
      transformOrigin: 'left top',
      userSelect: 'none',
      '&:hover': {
        outline: '1px solid var(--pdf-tooltip-color)',
      },
      '&:focus-within': {
        outline: '1px solid var(--pdf-tooltip-color)',
      },
      '& .editable-div-editing': {
        border: 'none',
      },
    },
    box: {
      cursor: 'move',
      border: '1px solid var(--pdf-tooltip-color)',
      padding: [4, 8],
    },

    disabled: {
      opacity: 0.7,
      pointerEvents: 'none',
    },
    editable: {
      outline: '2px solid var(--pdf-tooltip-color)',
      '&:hover': {
        outline: '2px solid var(--pdf-tooltip-color)',
      },
      '&:focus-within': {
        outline: '2px solid var(--pdf-tooltip-color)',
      },
      zIndex: 1,
      '& $box': {
        cursor: 'move',
      },
      '& $dragHandler': {
        display: 'block',
      },
    },

    svg: {
      pointerEvents: 'none',
      position: 'absolute',
      left: 0,
      top: 0,
      overflow: 'visible',
      stroke: 'var(--pdf-tooltip-color)',
      fill: 'var(--pdf-tooltip-color)',
      '& *': {
        pointerEvents: 'initial',
      },
    },

    dragHandler: {
      position: 'absolute',
      width: 8,
      height: 8,
      backgroundColor: '#fff',
      border: '1px solid var(--pdf-tooltip-color)',
      transform: 'translate(-50%, -50%)',
      display: 'none',
    },

    widthResizer: {
      cursor: 'ew-resize',
      height: '80%',
      width: 6,
    },
    pointResizer: {
      cursor: 'move',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
