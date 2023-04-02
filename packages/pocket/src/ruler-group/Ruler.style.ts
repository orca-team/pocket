import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const rulerBackgroundColor = '#DDD';

const prefix = 'ruler';
export default createUseStyles(
  {
    root: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: rulerBackgroundColor,
      overflow: 'hidden',

      '& > canvas': {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [
      jssAutoPrefix({
        prefix,
      }),
    ],
  },
);
