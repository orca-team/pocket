import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'orca-loading-div';
export default createUseStyles(
  {
    root: {
      position: 'relative',
    },
    absMode: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    },
    loadingContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'opacity 300ms',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      pointerEvents: 'none',
    },
    loading: {
      opacity: 1,
      pointerEvents: 'initial',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [
      jssAutoPrefix({
        prefix,
      }),
    ],
  },
);
