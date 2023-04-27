import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../../utils/jss';

const prefix = 'virtual-calendar-week';
export default createUseStyles(
  {
    root: {
      display: 'flex',
      position: 'relative',
    },

    checked: {},

    date: {
      height: '100%',
      flex: 1,
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
