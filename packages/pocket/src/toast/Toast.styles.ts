import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'orca-toast';
export default createUseStyles(
  {
    root: {
      position: 'fixed',
      left: '50%',
      bottom: '30px',
      transform: 'translate(-50%, -50%)',
      opacity: '1',
      transition: 'opacity 300ms',
      backgroundColor: 'rgba(125, 125, 125, 0.6)',
      color: '#ffffff',
      padding: '5px 10px',
      borderRadius: '4px',
      zIndex: '1',
    },

    centered: {
      bottom: 'unset',
      top: '50%',
    },

    hide: {
      opacity: '0',
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
