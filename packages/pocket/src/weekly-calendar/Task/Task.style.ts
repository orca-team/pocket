import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../../utils/jss';

const prefix = 'weekly-calendar-task';
export default createUseStyles(
  {
    root: {
      position: 'absolute',
      backgroundColor: 'rgb(250 250 250 / 50%)',
      border: '3px solid transparent',
      borderRadius: '4px',
    },

    hover: {
      borderColor: '#19f',
    },

    checked: {
      borderColor: '#19f',
    },

    placeholder: {
      pointerEvents: 'none',
      border: '2px solid #19f',
      backgroundColor: 'rgb(17 153 255 / 10%)',
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
