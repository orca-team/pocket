import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'flop';
export default createUseStyles(
  {
    root: {
      fontSize: 24,
      '& > *': {
        whiteSpace: 'nowrap',
      },
    },
    countup: {},
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
