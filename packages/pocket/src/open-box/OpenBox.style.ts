import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'orca-open-box';

export default createUseStyles(
  {
    root: {
      transition: 'height 300ms',
      padding: '0',
      overflow: 'hidden',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
