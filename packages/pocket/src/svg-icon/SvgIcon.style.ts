import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'orca-svg-icon';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      fontSize: 16,
      fill: 'currentColor',
      width: '1em',
      height: '1em',
      minWidth: '1em',
      minHeight: '1em',
    },
    '@keyframes anim-spinning': {
      from: {
        transform: 'rotate(0)',
      },
      to: {
        transform: 'rotate(360deg)',
      },
    },
    spinning: {
      animationName: '$anim-spinning',
      animationDuration: '1.5s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
