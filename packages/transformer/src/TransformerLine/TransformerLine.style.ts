import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

export const prefix = 'orca-transformer-line';

export default createUseStyles(
  {
    root: {
      position: 'absolute',
      width: 0,
      height: 0,
      userSelect: 'none',
      overflow: 'visible',
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

      '& $pointHandle, & $moveHandle, & $content': {
        visibility: 'visible',
      },
    },
    moveHandle: {
      position: 'absolute',
      height: 8,
      visibility: 'hidden',
      cursor: 'move',
    },
    pointHandle: {
      width: 8,
      height: 8,
      border: '1px solid #0081ff',
      backgroundColor: 'white',
      transform: 'translate(-50%, -50%)',
      position: 'absolute',
      visibility: 'hidden',
      cursor: 'move',
    },
    content: {
      position: 'absolute',
      visibility: 'hidden',
      pointerEvents: 'none',
      '& > *': {
        pointerEvents: 'initial',
      },
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
