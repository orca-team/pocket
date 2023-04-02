import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'orca-json-viewer';
export default createUseStyles(
  {
    root: {
      fontFamily: 'Consolas, "Courier New", monospace',
    },

    item: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'default',

      '& *': {
        whiteSpace: 'nowrap',
      },

      '&:hover': {
        '& $operator': {
          display: 'block',
        },
      },
    },

    indent: {
      height: '1em',
    },

    arrow: {
      marginTop: '0.2em',

      '& > *': {
        transform: 'rotate(0deg)',
        transition: 'transform 300ms',
      },
    },

    arrowOpen: {
      '& > *': {
        transform: 'rotate(90deg)',
      },
    },

    key: {
      marginRight: '0.5em',
      color: '#792675',
      fontWeight: 'bold',

      '&:after': {
        content: '\':\'',
      },
    },
    keyOnly: {},
    '&$keyOnly:after': {
      display: 'none',
    },

    typeNumber: {
      color: '#1a1aa6',
    },

    typeBoolean: {
      color: '#1a1aa6',
    },

    typeString: {
      color: '#9e3379',
    },

    typeNull: {
      color: '#717171',
    },

    typeUndefined: {
      color: '#717171',
    },

    typeObject: {},

    operator: {
      display: 'none',
      color: '#1199ff',
      marginLeft: '8px',

      '& > *': {
        cursor: 'pointer',
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
