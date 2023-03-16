import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'toolbar-button';

export default createUseStyles(
  {
    root: {
      position: 'relative',
    },
    text: {
      fontSize: 14,
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
