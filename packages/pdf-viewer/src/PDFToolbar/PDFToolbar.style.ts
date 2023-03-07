import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'pdf-toolbar';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      height: 40,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#EEE',
      borderBottom: '1px solid #DDD',
    },
    left: {
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      flex: 1,
    },
    center: {
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    },
    right: {
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end',
      height: '100%',
      flex: 1,
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
