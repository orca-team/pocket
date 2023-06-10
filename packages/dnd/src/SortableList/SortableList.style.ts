import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'orca-sortable-list';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      '& .orca-sortable-helper-dragging': {
        opacity: 0.4,
      },
    },
    handle: {
      cursor: 'move',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
