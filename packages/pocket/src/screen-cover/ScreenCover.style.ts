import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'screen-cover';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      visibility: 'hidden',
      height: 0,
      overflow: 'hidden',
    },
    show: {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      visibility: 'visible',
    },
    mask: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {},
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
