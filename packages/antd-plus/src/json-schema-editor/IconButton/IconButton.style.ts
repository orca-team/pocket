import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../../../../pocket/src/utils/jss';

const prefix = 'json-schema-editor-icon-button';
export default createUseStyles(
  {
    root: {
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      // transition: 'backgroundColor 300ms',

      '&:hover': {
        // color: '#FFFFFF',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        // border: '1px solid #1199ff',
      },

      '&$checked': {
        color: '#FFFFFF',
        border: '1px solid #1199ff',
        backgroundColor: '#1199ff',
      },

      '&:active': {
        transform: 'translateY(1px)',
      },
    },

    disabled: {
      cursor: 'default',
      opacity: '0.6',
      pointerEvents: 'none',
    },

    checked: {},

    dark: {
      // backgroundColor: '#333333',
      // border: '1px solid #444444',
      color: '#CCCCCC',

      '&$checked, &:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        // color: '#FFFFFF',
        // backgroundColor: '#1199ff',
        // border: '1px solid #1199ff',
      },
    },

    small: {
      fontSize: '14px',
      width: '25px',
      height: '25px',
    },

    'x-small': {
      fontSize: '12px',
      width: '22px',
      height: '22px',
    },

    middle: {
      width: '32px',
      height: '32px',
      fontSize: '16px',
    },

    large: {
      width: '36px',
      height: '36px',
      padding: '0px 16px',
      fontSize: '22px',
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
