import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'ruler-group';

const rulerBackgroundColor = '#DDD';

export default createUseStyles(
  {
    corner: {
      position: 'absolute',
      top: '0',
      left: '0',
      backgroundColor: rulerBackgroundColor,
      borderRight: '1px solid #AAAAAA',
      borderBottom: '1px solid #AAAAAA',
      color: '#666666',
      textAlign: 'center',
      cursor: 'pointer',

      '&:hover': {
        color: '#333333',
        backgroundColor: '#EEEEEE',
      },

      '&:active': {
        marginTop: '1px',
      },
    },

    lineTip: {
      position: 'absolute',
      top: '5px',
      left: '5px',
      padding: '1px 5px',
      fontSize: '10px',
      borderRadius: '4px',
      color: '#0091FF',
      backgroundColor: 'rgba(0, 145, 255, 0.0)',
      transition: 'color 300ms, background-color 300ms',
      pointerEvents: 'none',
      userSelect: 'none',
    },

    line: {
      position: 'absolute',
      top: '0',
      left: '0',

      borderLeft: '2px solid #0091FF',
      borderTop: '2px solid #0091FF',
      borderRight: '0px solid transparent',
      borderBottom: '0px solid transparent',

      '&:hover': {
        '& $lineTip': {
          color: '#FFFFFF',
          backgroundColor: 'rgba(0, 145, 255, 0.8)',
        },
      },
    },

    preview: {
      pointerEvents: 'none',
      borderStyle: 'dashed',
      borderTopWidth: '1px',
      borderLeftWidth: '1px',
      borderColor: 'rgba(0, 129, 255, 0.6)',

      '& $lineTip': {
        color: '#FFFFFF',
        backgroundColor: 'rgba(0, 145, 255, 0.6)',
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
