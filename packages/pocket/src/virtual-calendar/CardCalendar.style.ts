import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'card-calendar';
const dateCellStyle = {
  borderColor: 'transparent',
  backgroundColor: 'unset',
  color: 'unset',
};
export default createUseStyles(
  {
    root: {
      width: '300px',
      height: '360px',
      fontSize: '1em',

      '--virtual-calendar-hover-color': 'rgb(161 214 255)',

      '& .virtual-calendar-toolbar': {
        fontSize: '1.2em',
      },

      '& .virtual-calendar-background-month': {
        fontSize: '2.5em',
      },

      '& .virtual-calendar-date-cell-today': {
        '& $dateStr': {
          backgroundColor: 'var(--virtual-calendar-today-color)',
          color: 'var(--virtual-calendar-text-color-checked)',
        },
      },

      '& .virtual-calendar-date-cell-root:hover, & .virtual-calendar-date-cell-root::before': {
        backgroundColor: 'unset',
      },

      '& .virtual-calendar-date-cell-checked': dateCellStyle,
      '& .virtual-calendar-date-cell-checked:hover': dateCellStyle,
      '& .virtual-calendar-date-cell-checked.virtual-calendar-date-cell-current-month': dateCellStyle,
    },

    date: {},

    dateStr: {
      position: 'relative',
      width: '2em',
      height: '2em',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 300ms, background-color 300ms',
      overflow: 'hidden',
    },

    checkModeDay: {
      '& $dateStr::before': {
        position: 'absolute',
        content: '\' \'',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        opacity: '1',
        zIndex: '0',
        pointerEvents: 'none',
        transition: 'opacity 300ms, background-color 300ms',
      },
    },

    checkModeWeek: {
      '.virtual-calendar-week-root': {
        '&::before': {
          content: '\' \'',
          position: 'absolute',
          top: '4px',
          left: '0',
          width: '100%',
          height: '2em',
          borderRadius: '1em',
          opacity: '0',
          transition: 'opacity 300ms, background-color 300ms',
        },
      },
    },

    // 可選中模式下的效果
    checkable: {
      '&$checkModeDay': {
        '& $date': {
          '&:hover': {
            '& $date-str::before': {
              backgroundColor: 'var(--virtual-calendar-hover-color)',
              opacity: '1',
            },
          },
        },

        '& .virtual-calendar-date-cell-checked': {
          '& $date': {
            '&, &:hover': {
              $dateStr: {
                color: 'var(--virtual-calendar-text-color-checked)',

                '&::before': {
                  backgroundColor: 'var(--virtual-calendar-primary-color)',
                  opacity: '1',
                },
              },
            },
          },
        },
      },

      '&$checkModeWeek': {
        '& .virtual-calendar-week-root': {
          '&:hover': {
            '&::before': {
              opacity: '0.15',
            },
          },

          '&.virtual-calendar-week-checked': {
            '&::before': {
              opacity: '0.2',
            },
          },
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
