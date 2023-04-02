import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'shape-renderer';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      overflow: 'visible',
      '--svg-stroke-width': 1,
    },
    svg: {
      position: 'absolute',
      left: 0,
      top: 0,
      pointerEvents: 'none',
      overflow: 'visible',
      stroke: '#f00',
      fill: 'none',
    },
    svgHit: {
      pointerEvents: 'initial',
      strokeWidth: 'calc(var(--svg-stroke-width) + 5)',
      stroke: 'transparent',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
