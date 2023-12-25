import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'orca-menu-layout';

const transitionStyle = {
  transition: 'color 300ms, background-color 300ms',
};

export default createUseStyles(
  {
    root: {
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },

    /* 左侧菜单为主时，其他内容的覆写 */

    mainSideLeft: {
      '&$root': {
        flexDirection: 'row',
      },

      '& $center': {
        flexDirection: 'column',
      },

      '& $sideMenuContainer': {
        zIndex: '1',
      },

      '& $logoContainer': {
        borderBottom: '1px solid rgba(125, 125, 125, 0.3)',
      },

      '& $collapseHandle': {
        padding: '0',
        borderBottom: 'none',
      },
    },

    header: {
      extend: transitionStyle,
      position: 'relative',
      padding: '0 20px',
      width: '100%',
      flexShrink: '0',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#262931',
      color: 'rgba(255, 255, 255, 0.85)',
      borderBottom: '1px solid rgba(125, 125, 125, 0.3)',

      '& *': {
        boxSizing: 'border-box',
      },

      '& a': {
        textDecoration: 'none',
      },
    },
    logo: {},
    leftSide: {},
    logoContainer: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      alignItems: 'center',

      '&$leftSide': {
        width: '100%',
        height: '48px',
        paddingLeft: '20px',
        transition: 'padding-left 300ms',
      },
    },

    title: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      fontSize: '20px',
      fontWeight: 'bold',
      cursor: 'default',
      transition: 'opacity 300ms',
      marginLeft: '8px',
      opacity: '1',
    },

    collapsed: {
      '& $logoContainer$leftSide': {
        paddingLeft: '12px',
      },

      '& $title': {
        // position: 'absolute',
        opacity: '0',
      },
    },

    headerMenu: {
      marginLeft: '50px',
    },

    center: {
      flex: '1',
      display: 'flex',
      overflow: 'hidden',
    },
    topSplitter: {},
    sideMenuContainer: {
      transition: 'color 300ms, width 300ms, background-color 300ms',
      width: '220px',
      flexShrink: '0',
      overflow: 'auto',
      // overflowX: 'hidden',
      color: 'rgba(255, 255, 255, 0.85)',
      backgroundColor: '#272931',
      boxShadow: '0 0 5px #666666',
      display: 'flex',
      flexDirection: 'column',

      '& *': {
        boxSizing: 'border-box',
      },

      '& a': {
        textDecoration: 'none',
      },

      '&$topSplitter': {
        // borderTop: '1px solid rgba(125, 125, 125, 0.3)',
      },

      '&$collapsed': {
        width: '54px',
      },
    },

    collapseHandle: {
      extend: transitionStyle,
      flexShrink: '0',
      height: '35px',
      fontSize: '1.3em',
      display: 'flex',
      padding: '0 20px',
      alignItems: 'center',
      borderBottom: '1px solid rgba(125, 125, 125, 0.3)',
      color: 'rgba(125, 125, 125, 0.9)',
      cursor: 'pointer',
      backgroundColor: 'rgba(125, 125, 125, 0)',

      '&:hover': {
        backgroundColor: 'rgba(125, 125, 125, 0.2)',
      },
    },

    collapseHandleIcon: {
      transition: 'transform 300ms',
      transform: 'rotate(0deg)',

      '&$collapsed': {
        transform: 'rotate(-360deg)',
      },
    },

    sideMenu: {
      extend: transitionStyle,
      overflow: 'auto',
      flex: '1',
    },

    content: {
      flex: '1',
      overflow: 'auto',
    },

    /* theme light */
    '@global': {
      [`.${prefix}-theme-light`]: {
        '&$header': {
          backgroundColor: '#ffffff',
          color: 'rgba(0, 0, 0, 0.85)',
        },

        '& $collapseHandle': {
          backgroundColor: 'transparent',
        },

        '&$sideMenuContainer': {
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
          color: 'rgba(0, 0, 0, 0.85)',
          backgroundColor: '#ffffff',
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
