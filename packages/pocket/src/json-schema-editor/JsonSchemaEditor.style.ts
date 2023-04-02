import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'json-schema-editor';

const flexCenterStyle = {
  display: 'flex',
  alignItems: 'center',
};
export default createUseStyles(
  {
    root: {
      position: 'relative',
    },

    dragHandle: {
      opacity: '0',
      transition: 'opacity 300ms',
    },

    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px',
      borderRadius: '4px',
      backgroundColor: 'transparent',

      '&:hover': {
        backgroundColor: 'rgba(125, 125, 125, 0.1)',

        '& $dragHandle': {
          opacity: '1',
        },
      },
    },

    itemLeft: {
      extend: [flexCenterStyle],
      flex: '1',
    },

    itemRight: {
      extend: [flexCenterStyle],
      flexShrink: '0',
      flexBasis: '70%',
    },

    itemSpace: {
      flexShrink: '0',
      width: '32px',
      height: '32px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    icon: {
      transition: 'transform 300ms',
      transform: 'rotate(0)',
    },

    open: {
      transform: 'rotate(90deg)',
    },

    checkbox: {
      textAlign: 'center',
    },

    itemType: {
      width: 100,
      flexShrink: '0',
    },

    button: {
      cursor: 'pointer',
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
