import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../../utils/jss';

const prefix = 'weekly-calendar-time-tip';
export default createUseStyles(
  {
    line: {
      borderTop: '1px dashed var(--time-tip-color)',
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',

      '&::before': {
        content: '\' \'',
        position: 'absolute',
        width: '5px',
        height: '5px',
        left: '0',
        top: '-3px',
        backgroundColor: 'var(--time-tip-color)',
        borderRadius: '50%',
      },
    },
    visible: {},
    text: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      color: 'var(--time-tip-color)',
      padding: '2px 4px',
      backgroundColor: 'rgb(250 250 250 / 70%)',
      borderRadius: '4px',
    },
    root: {
      position: 'absolute',
      left: '0',
      width: '100%',
      opacity: '0',
      transition: 'opacity 300ms',
      pointerEvents: 'none',
      '--time-tip-color': '#19f',
      '&$visible': {
        opacity: '1',

        '& $text': {
          opacity: '1',
        },
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
