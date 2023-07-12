import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '@orca-fe/simple-jss';

const prefix = 'orca-dialog';
export default createUseStyles(
  {
    wrapper: {
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '10000',
    },
    root: {
      position: 'relative',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: 'calc(100vh - 32px)',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
      color: '#000000d9',
      fontSize: '14px',
      boxShadow: '0 0 32px rgba(50, 50, 50, 0.5)',
      borderRadius: '4px',
      transition: 'box-shadow 200ms, transform 200ms, opacity 200ms',
      overflowX: 'hidden',
      transformOrigin: 'center',
      transform: 'scale(1)',
      display: 'flex',
      flexDirection: 'column',
      opacity: '1',
      border: '1px solid transparent',
    },

    middle: {
      '& $header': {
        padding: '0 20px',
        height: '40px',
      },

      '& $body': {
        padding: '16px 20px',
      },
    },

    small: {
      '& $header': {
        padding: '0 16px',
        height: 32,

        '& $title': {
          fontSize: 14,
        },
      },

      '& $body': {
        padding: '12px 16px',
      },

      '& $footer': {
        padding: '8px 12px',
      },
    },

    hidden: {
      pointerEvents: 'none',

      '& $root': {
        transform: 'scale(0.8)',
        opacity: 0,
      },
    },

    header: {
      position: 'relative',
      padding: '0px 24px',
      height: '52px',
      flexShrink: '0',
      borderBottom: '1px solid #DDDDDD',
      display: 'flex',
      alignItems: 'center',
      transition: 'padding 200ms, height 200ms',
    },

    title: {
      fontSize: 16,
      flex: 1,
      userSelect: 'none',
    },

    body: {
      position: 'relative',
      flex: 1,
      overflow: 'hidden',
      padding: 24,
      transition: 'padding 200ms, height 200ms',

      '& $scrollable': {
        overflow: 'auto',
      },
    },
    scrollable: {},
    footer: {
      flexShrink: 0,
      borderTop: '1px solid #DDDDDD',
      padding: '12px 16px',
      transition: 'padding 200ms',
    },

    buttons: {
      position: 'absolute',
      height: '100%',
      right: 0,
    },

    button: {
      position: 'relative',
      width: '48px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      transition: 'color 200ms, background-color 200ms',

      '&:hover': {
        backgroundColor: 'rgba(125, 125, 125, 0.3)',

        '&$buttonDanger': {
          backgroundColor: '#e81123',
          color: '#ffffff',
        },
      },

      '&:active': {
        opacity: 0.7,
      },
    },
    buttonDanger: {},
    buttonBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      opacity: 0,
      transition: 'opacity 200ms',
      zIndex: -1,
    },

    dragging: {
      boxShadow: '0 0 #ffffff',
      borderColor: '#DDDDDD',
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
