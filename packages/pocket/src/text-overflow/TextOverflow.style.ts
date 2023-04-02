import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'text-overflow';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      overflow: 'hidden',
    },

    pauseOnHover: {
      '&:hover': {
        '& $textWrapper': {
          animationPlayState: 'paused',
        },
      },
    },

    placeHolder: {
      overflow: 'hidden',
      width: '100%',
      // visibility: 'hidden',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      textAlign: 'center',
    },

    textWrapper: {
      position: 'absolute',
      top: '0',
      left: '0',
      animation: '$textOverflowAnimation 10000ms cubic-bezier(0.1, 0, 0.9, 1) infinite',
      visibility: 'hidden',
    },

    text: {
      position: 'absolute',
      top: '0',
      left: '0',
      whiteSpace: 'nowrap',
    },

    '@keyframes textOverflowAnimation': {
      '5%, 95%': {
        transform: 'translate3d(0, 0, 0)',
      },

      '45%, 50%, 55%': {
        transform: 'translate3d(-100%, 0, 0)',
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
