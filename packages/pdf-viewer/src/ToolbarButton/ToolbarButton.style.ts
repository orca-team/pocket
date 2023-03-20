import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'toolbar-button';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      padding: [0, 12],
    },
    icon: {
      fontSize: 20,
      lineHeight: '14px',
    },
    text: {
      fontSize: 14,
      whiteSpace: 'nowrap',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
