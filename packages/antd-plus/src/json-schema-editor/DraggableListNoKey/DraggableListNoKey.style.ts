import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../../../../pocket/src/utils/jss';

const prefix = 'draggable-list-no-key';
export default createUseStyles(
  {
    dragging: {},
    hoverStyle: {
      '&:not($dragging)': {
        '& $item': {
          '&:active': {
            opacity: '0.75',
          },

          '&:hover': {
            // color: '#FFFFFF',
            backgroundColor: 'rgba(18, 101, 210, 0.15)',
          },
        },
      },
    },
    checked: {},
    draggingItem: {},
    internalStyle: {
      '& $checked:not($draggingItem)': {
        color: '#FFFFFF',
        backgroundColor: '#1160aa',

        '&:hover': {
          backgroundColor: '#1774cc',
        },
      },

      '& $draggingItem': {
        opacity: '0.75',
        backgroundColor: 'rgba(125, 125, 125, 0.3)',
      },
    },
    root: {
      userSelect: 'none',
    },
    before: {},
    after: {},
    item: {
      position: 'relative',
      border: '1px solid transparent',

      '&:firstChild': {
        borderTopWidth: '2px',
      },

      '&:lastChild': {
        borderBottomWidth: '2px',
      },

      '&$before': {
        borderTopColor: '#1199ff',
      },

      '&$after': {
        borderBottomColor: '#1199ff',
      },
    },

    draggingNum: {
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
