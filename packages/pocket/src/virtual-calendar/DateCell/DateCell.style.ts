import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../../utils/jss';

const prefix = 'virtual-calendar-date-cell';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      transition: 'all 300ms',
      color: 'rgb(0 0 0 / 30%)',
      border: '4px solid transparent',
      opacity: '0.7',
      cursor: 'default',

      '&::before': {
        position: 'absolute',
        content: '\' \'',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--virtual-calendar-primary-color)',
        opacity: '0',
        transition: 'opacity 300ms',
        zIndex: '0',
        pointerEvents: 'none',
      },
    },

    today: {},
    checked: {},

    date: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },

    text: {
      fontSize: '1.5em',
    },

    extra: {
      fontSize: '0.8em',
    },

    currentMonth: {
      color: 'rgb(0 0 0 / 85%)',
      opacity: '1',
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
