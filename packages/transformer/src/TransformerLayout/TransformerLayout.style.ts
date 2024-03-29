import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'orca-transformer-layout';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      height: 200,
      '--transformer-layout-scale': 1,
    },
    contentContainer: {
      position: 'absolute',
      zIndex: 0,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    noEvents: {
      pointerEvents: 'none',
      '& > *': {
        pointerEvents: 'initial',
      },
      '& $contentContainer': {
        pointerEvents: 'none',
        '& > *': {
          pointerEvents: 'initial',
        },
      },
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
