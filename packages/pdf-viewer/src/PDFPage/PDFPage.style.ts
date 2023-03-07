import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'pdf-page';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      border: '1px solid #DDD',
      height: '100%',
      overflow: 'hidden',
    },
    canvas: {
      width: '100%',
      height: '100%',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
