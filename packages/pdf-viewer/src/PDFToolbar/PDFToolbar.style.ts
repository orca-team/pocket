import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'pdf-toolbar';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      height: 48,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderBottom: '1px solid #DDD',
    },
    title: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      fontWeight: 'bold',
      fontSize: 16,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      userSelect: 'text',
    },
    left: {
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
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
      flexDirection: 'row-reverse',
    },
    hide: {
      display: 'none',
    },
    separator: {
      margin: [0, 16],
      borderLeft: '1px solid #DDD',
      height: 24,
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
