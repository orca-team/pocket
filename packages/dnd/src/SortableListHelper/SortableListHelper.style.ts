import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'orca-sortable-list-helper';

export default createUseStyles(
  {
    root: {
      position: 'relative',
    },
    item: {
      touchAction: 'none',
      transform: 'translate(var(--translate-x), var(--translate-y))',
      transition: 'var(--transition)',
    },
    handle: {
      cursor: 'move',
    },
    dragging: {
      zIndex: 1,
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
