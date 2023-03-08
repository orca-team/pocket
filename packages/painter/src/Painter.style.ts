import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'painter';
export default createUseStyles(
  {
    root: {
      position: 'relative',
    },
    canvasContainer: {
      width: '100%',
      height: '100%',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
