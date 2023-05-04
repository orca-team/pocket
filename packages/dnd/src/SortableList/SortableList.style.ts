import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'orca-sortable-list';

export default createUseStyles(
  {
    root: {
      position: 'relative',
    },
    item: {
      transform: 'translate(var(--translate-x), var(--translate-y))',
      transition: 'var(--transition)',
    },
    handle: {
      cursor: 'move',
    },
    dragging: {
      opacity: 0.4,
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
