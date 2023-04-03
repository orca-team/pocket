import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'shape-renderer';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      overflow: 'visible',

      '& .orca-transformer-box-root': {
        pointerEvents: 'none',
        cursor: 'move',
      },
      '& .orca-transformer-box-status-checked': {
        pointerEvents: 'initial',
      },
    },
    svgHit: {
      pointerEvents: 'initial',
      strokeWidth: 'calc(var(--svg-stroke-width, 1) + 5)',
      stroke: 'transparent',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
