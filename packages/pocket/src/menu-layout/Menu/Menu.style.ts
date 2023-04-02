import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../../utils/jss';

const prefix = 'orca-menu';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'stretch',
      height: '100%',
      backgroundColor: '#262931',
      fontSize: '14px',
      transition: 'color 300ms, background-color 300ms',

      [`&.${prefix}-theme-light`]: {
        backgroundColor: '#ffffff',
      },
    },

    vertical: {
      flexDirection: 'column',
      height: 'auto',
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
