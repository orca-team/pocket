import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'painter';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      height: 200,
    },
    canvasContainer: {
      width: '100%',
      height: '100%',
    },
    move: {
      cursor: 'move',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
