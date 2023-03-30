import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'pdf-viewer';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid #DDD',
      userSelect: 'none',

      '& .pdf-viewer-default-empty-tips': {
        pointerEvents: 'none',
        userSelect: 'none',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#AAA',
      },
      '& .pdf-viewer-default-loading-tips': {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        pointerEvents: 'none',
        userSelect: 'none',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#AAA',
      },
    },
    toolbar: {
      flexShrink: 0,
    },
    pages: {
      position: 'relative',
      height: '100%',
      overflow: 'auto',
      padding: '24px 0',
      flex: 1,
      backgroundColor: '#f0f2f5',
      paddingBottom: 48,
    },
    pageContainer: {
      position: 'relative',
      backgroundColor: '#fff',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxShadow: [0, 0, 12, 'rgba(0, 0, 0, 0.3)'],
    },
    page: {
      width: '100%',
      height: '100%',
    },
    pageCover: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      '& > *': {
        pointerEvents: 'initial',
      },
    },
    pageController: {
      position: 'absolute',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
