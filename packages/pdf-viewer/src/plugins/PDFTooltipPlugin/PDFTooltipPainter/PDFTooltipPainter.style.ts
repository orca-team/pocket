import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'pdf-tooltip-painter';

export default createUseStyles(
  {
    root: {
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
    drawing: {
      '&:hover': {
        outline: '2px solid #19f',
      },
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
