import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '@orca-fe/simple-jss';

const prefix = 'weekly-calendar';
export default createUseStyles(
  {
    root: {
      position: 'relative',
      height: '500px',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '14px',
      '& *': {
        boxSizing: 'border-box',
      },

      '--timeline-width': '80px',
      '--weekly-calendar-primary-color': '#19f',
    },
    weekMode: {},
    dayMode: {
      '& $hoverDay': {
        width: '100%',
      },
    },
    timelineTitle: {
      padding: '12px',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      borderBottom: '1px solid #ddd',
    },
    timeline: {
      width: 'var(--timeline-width)',
      borderRight: '1px solid #ddd',
      flexShrink: '0',
      position: 'relative',
    },

    calendarContainer: {
      position: 'relative',
      flex: '1',
      display: 'flex',
      flexDirection: 'row',
      overflowX: 'hidden',
    },

    header: {
      height: '90px',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',

      '& $calendarContainer': {
        overflow: 'hidden',
      },
    },

    body: {
      flex: '1',
    },

    column: {
      flex: '1',
      flexShrink: '0',
      overflow: 'hidden',
    },

    bodyContent: {
      position: 'relative',
      minHeight: '100%',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',

      '& $column': {
        pointerEvents: 'none',
      },
    },

    weekdayName: {
      height: '50px',
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      borderRight: '1px solid #ddd',
      borderBottom: '1px solid #ddd',
    },

    date: {
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      padding: '0 12px',
      borderRight: '1px solid #ddd',
      borderBottom: '1px solid #ddd',
    },

    dateValue: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '1.8em',
      minHeight: '1.8em',
    },

    lunarDate: {
      fontSize: 'small',
      color: 'rgba(0 0 0 / 45%)',
      marginLeft: '4px',
    },

    today: {
      '& $dateValue': {
        borderRadius: '50%',
        backgroundColor: 'var(--weekly-calendar-primary-color)',
        color: '#fff',
      },
    },

    hour: {
      height: '4.1667%',
      minHeight: '60px',
    },

    hourTimeline: {
      transform: 'translateY(-50%)',
      textAlign: 'center',
      fontSize: '14px',
      color: '#666',
    },

    hourCalendar: {
      pointerEvents: 'none',
      borderRight: '1px solid #ddd',
      borderBottom: '1px solid #ddd',
    },

    hoverContainer: {
      position: 'absolute',
      top: '0',
      left: 'var(--timeline-width)',
      width: 'calc(100% - var(--timeline-width))',
      height: '100%',
      pointerEvents: 'none',
    },
    visible: {},
    hoverDay: {
      position: 'absolute',
      top: '2px',
      width: '14.2857%',
      height: 'calc(100% - 4px)',
      backgroundColor: 'var(--weekly-calendar-primary-color)',
      opacity: '0',
      borderRadius: '4px',
      transition: 'left 300ms, opacity 300ms',

      '&$visible': {
        opacity: '0.1',
      },
    },
    task: {},
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
