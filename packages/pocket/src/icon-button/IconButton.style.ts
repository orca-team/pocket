import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'orca-icon-button';

const darkCheckedStyle = {
  color: '#ffffff',
  backgroundColor: 'rgba(200, 200, 200, 0.2)',
};
const defaultCheckedStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
};
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
      transition: 'background-color 300ms',

      '&:hover': defaultCheckedStyle,
      '&$checked': defaultCheckedStyle,
      '&:active': {
        transform: 'translateY(1px)',
      },
    },
    autoWidth: {
      width: 'auto',
    },
    checked: {},
    disabled: {
      cursor: 'default',
      opacity: '0.6',
      pointerEvents: 'none',
    },
    dark: {
      color: '#CCCCCC',
      '&.$checked': darkCheckedStyle,
      '&:hover': darkCheckedStyle,
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
      fontSize: '18px',
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
    plugins: [jssAutoPrefix({ prefix })],
  },
);
