import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'painter';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      height: 200,
      outline: 'none !important',
      '--painter-scale': 1,
      '--transformer-layout-scale': 'var(--painter-scale)',
    },
    canvasContainer: {
      width: '100%',
      height: '100%',
    },
    move: {
      cursor: 'move',
    },
    transformingRect: {
      position: 'absolute',
      pointerEvents: 'none',
    },
    img: {
      height: '100%',
      width: '100%',
    },
    transformerLayout: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
