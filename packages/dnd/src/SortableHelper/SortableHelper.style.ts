import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'orca-sortable-helper';

export default createUseStyles(
  {
    root: {
      position: 'relative',
    },
    item: {
      touchAction: 'none',
      // transform: 'translate(var(--translate-x), var(--translate-y))',
      transition: 'var(--transition)',
      willChange: 'transform',
    },
    handle: {
      cursor: 'move',
    },
    dragging: {
      zIndex: 1,
    },
    defaultSubSortableEmptyPlaceHolder: {
      color: '#AAA',
      textAlign: 'center',
      border: '1px dashed #DDD',
      padding: [12, 0],
      pointerEvents: 'none',
      userSelect: 'none',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
