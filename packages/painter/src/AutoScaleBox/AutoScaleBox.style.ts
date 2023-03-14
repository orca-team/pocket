import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'auto-scale-box';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      overflow: 'hidden',
    },
    container: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transformOrigin: 'center',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
