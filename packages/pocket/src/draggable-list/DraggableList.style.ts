import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'draggable-list';
export default createUseStyles(
  {
    dragging: {},
    draggingNum: {},
    before: {},
    after: {},
    checked: {},
    draggingItem: {},
    internalStyle: {
      '&:not($dragging)': {
        '& $item': {
          '&:active': {
            opacity: 0.75,
          },

          '&:hover': {
            backgroundColor: 'rgba(18, 101, 210, 0.15)',
          },
        },
      },

      checked: {
        '&:not(.draggingItem)': {
          color: '#FFFFFF',
          backgroundColor: '#1160aa',

          '&:hover': {
            backgroundColor: '#1774cc',
          },
        },
      },

      draggingItem: {
        opacity: '0.75',
        backgroundColor: 'rgba(125, 125, 125, 0.3)',
      },
    },

    root: {
      userSelect: 'none',
    },

    item: {
      position: 'relative',
      border: '1px solid transparent',

      '&$before': {
        borderTopColor: '#1199ff',
      },

      '&$after': {
        borderBottomColor: '#1199ff',
      },
    },

    '&$draggingNum': {
      position: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1199ff',
      border: '2px solid #0974c4',
      color: '#FFFFFF',
      borderRadius: '12px',
      padding: '0 10px',
      marginTop: '5px',
      marginLeft: '10px',
      userSelect: 'none',
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
