import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'popup-box';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      borderRadius: 4,
      backgroundColor: '#f6f6f6',
      padding: 4,
      boxShadow: '0 0 12px rgba(125, 125, 125, 0.5)',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
