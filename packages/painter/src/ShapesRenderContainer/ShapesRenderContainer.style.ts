import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'shapes-render-container';

export default createUseStyles(
  {
    root: {
      position: 'relative',
    },
    pointer: {
      cursor: 'pointer',
    },
    svg: {
      position: 'absolute',
      left: 0,
      top: 0,
      pointerEvents: 'none',
      overflow: 'visible',
      stroke: '#f00',
      fill: 'none',
      outline: 'none !important',
      '--svg-stroke-width': 1,
      transform: 'scale(var(--painter-scale, 1))',
      transformOrigin: 'left top',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
