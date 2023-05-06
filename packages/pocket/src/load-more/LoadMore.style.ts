import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'orca-load-more';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      overflow: 'auto',
    },
    loadingContent: {
      height: '50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#aaaaaa',
      userSelect: 'none',
    },
    canLoadMore: {
      cursor: 'pointer',
    },
    noMore: {},
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
