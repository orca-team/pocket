import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import alphaBg from './alphaBg';

const prefix = 'color-preview';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      backgroundImage: `url(${alphaBg})`,
      backgroundSize: '100% 100%',
      overflow: 'hidden',
    },
    color: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
