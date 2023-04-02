import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'simple-number-input';
export default createUseStyles(
  {
    root: {
      display: 'inline-block',
    },

    editable: {
      '&:not($editing)': {
        color: '#1199ff',
        textDecoration: 'underline',
        cursor: 'ew-resize',
      },
    },

    editing: {
      border: '2px solid #1199ff',
      borderRadius: '4px',
      paddingLeft: '2px',
      paddingRight: '2px',
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
