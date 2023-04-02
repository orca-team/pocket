import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'editable-div';
export default createUseStyles(
  {
    root: {
      minWidth: '0.6em',

      '& pre': {
        overflow: 'hidden',
        whiteSpace: 'break-spaces',
        wordWrap: 'normal',
        marginBottom: 0,
        marginTop: 0,

        '&:focus ': {
          outline: 'none',
          border: 'none',
        },
      },
    },
    editing: {
      border: '2px solid #1199ff',
      borderRadius: '4px',
      paddingLeft: '2px',
      paddingRight: '2px',
      textOverflow: 'initial !important',
      cursor: 'initial',
      '&:not(.transparent)': {
        backgroundColor: '#ffffff',
        color: '#333333',
      },
    },

    compact: {
      borderRadius: '2px',
      lineHeight: '1.2em',
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
