import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../../../utils/jss';

const beforeAfterStyle = {
  position: 'absolute',
  content: '\'\'',
  width: '6px',
  height: '1.5px',
  borderRadius: '2px',
  backgroundColor: '#cccccc',
  top: '0px',
  left: '0',
  transition: 'transform 300ms',
};

const prefix = 'arrow';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      cursor: 'pointer',
    },

    before: {
      extend: beforeAfterStyle,
      left: '-3px',
      transformOrigin: 'center',
      transform: 'rotate(-45deg)',
    },

    after: {
      extend: beforeAfterStyle,
      transformOrigin: 'center',
      transform: 'rotate(45deg)',
    },

    down: {
      '& $before': {
        transform: 'rotate(45deg)',
      },

      '& $after': {
        transform: 'rotate(-45deg)',
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
