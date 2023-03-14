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

      '& .pdf-viewer-default-empty-tips': {
        pointerEvents: 'none',
        userSelect: 'none',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#AAA',
      },
    },
    painter: {
      '&$drawing': {
        zIndex: 10,
      },
    },
    drawing: {},
    toolbar: {
      flexShrink: 0,
    },
    pages: {
      position: 'relative',
      height: '100%',
      overflow: 'auto',
      padding: '24px 0',
      flex: 1,
    },
    pageContainer: {
      position: 'relative',
      backgroundColor: '#fff',
      marginLeft: 'auto',
      marginRight: 'auto',
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
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
