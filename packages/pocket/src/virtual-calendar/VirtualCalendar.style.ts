import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'virtual-calendar';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      height: '720px',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '1.5em',
      overflow: 'hidden',

      '--virtual-calendar-primary-color': '#19f',
      '--virtual-calendar-today-color': '#19f',
      '--virtual-calendar-text-color-checked': '#fff',
    },
    toolbar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5em',
      padding: '0.5em',
    },
    button: {
      padding: '0 0.2em',

      '&:active': {
        backgroundColor: 'rgb(125 125 125 / 35%)',
      },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      color: 'rgb(0 0 0 / 65%)',
      height: '2em',
    },
    headerItem: {
      flex: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      overflow: 'hidden',
      flex: '1',
    },
    virtualList: {
      '&::-webkit-scrollbar': {
        width: '0',
      },
    },
    backgroundMonth: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '6em',
      whiteSpace: 'nowrap',
      color: 'rgb(0 0 0 / 5%)',
    },

    checkable: {
      '& .virtual-calendar-date-cell-root': {
        '&:hover': {
          backgroundColor: 'rgb(125 125 125 / 15%)',
        },
      },

      '& .virtual-calendar-date-cell-checked': {
        '&, &:hover,&.virtual-calendar-date-cell-current-month': {
          '&::before': {
            opacity: '0.6',
          },

          color: 'var(--virtual-calendar-text-color-checked)',
          borderColor: 'var(--virtual-calendar-primary-color)',
        },
      },
    },

    showToday: {
      '& .virtual-calendar-date-cell-today': {
        '&, &:hover, &.virtual-calendar-date-cell-current-month': {
          backgroundColor: 'var(--virtual-calendar-today-color)',
          color: 'var(--virtual-calendar-text-color-checked)',
        },
      },
    },
    parentValue: {},
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
