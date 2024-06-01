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
      boxSizing: 'border-box',

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
    pagesOuter: {
      position: 'relative',
      flex: 1,
      height: '100%',
      overflow: 'hidden',
    },
    pages: {
      position: 'relative',
      height: '100%',
      overflow: 'auto',
      // padding: '24px 0',
      backgroundColor: '#f0f2f5',
      // paddingBottom: 48,
    },
    pageContainer: {
      position: 'absolute',
      backgroundColor: '#fff',
      // marginLeft: 'auto',
      // marginRight: 'auto',
      boxShadow: [0, 0, 12, 'rgba(0, 0, 0, 0.3)'],
      left: '0%',
      // transform: 'translateX(-50%)',
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
    droppable: {
      '&[over]:after': {
        pointerEvents: 'none',
        boxSizing: 'border-box',
        border: '1px solid #19f',
        content: '\'\'',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,129,255,0.3)',
      },
    },
    pageBottomPlaceholder: {
      position: 'absolute',
      pointerEvents: 'none',
      visibility: 'hidden',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
