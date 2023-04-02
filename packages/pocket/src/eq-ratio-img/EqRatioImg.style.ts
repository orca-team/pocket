import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'eq-ratio-img';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    defaultHeight: {
      height: '150px',
    },

    hiddenImg: {
      width: '100%',
      position: 'absolute',
      visibility: 'hidden',
      pointerEvents: 'none',
    },

    hiddenImgPlaceholder: {
      position: 'relative',
    },

    img: {
      position: 'absolute',
      top: '0',
      left: '0',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '100%',
      height: '100%',
      opacity: '0',
      transition: 'opacity 300ms',
    },

    show: {
      opacity: '1',
    },

    defaultImg: {
      padding: '20px',
      fontSize: '50px',
      color: 'rgba(125, 125, 125, 0.4)',
    },

    errorTip: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(125, 125, 125, 0.1)',
      textShadow: '0 0 1px #fff',
      color: '#999999',
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
