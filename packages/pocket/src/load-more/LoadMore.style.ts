import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

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
