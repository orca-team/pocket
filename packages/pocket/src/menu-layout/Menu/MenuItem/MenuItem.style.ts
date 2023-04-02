import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../../../utils/jss';

export const prefix = 'orca-menu-item';

const colorTransitionStyle = {
  transition: 'color 300ms, background-color 300ms',
  color: '#cccccc',

  '&:hover': {
    color: '#ffffff',
  },
};

export default createUseStyles(
  {
    '@global': {
      '.orca-menu-sub-menu': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        boxShadow: 'inset 0 3px 3px rgba(10, 10, 10, 0.5)',
      },

      'div.orca-menu-item-link': {
        cursor: 'default',
      },
      [`.${prefix}-text-anim-appear, .${prefix}-text-anim-enter`]: {
        opacity: 0,
      },
      [`.${prefix}-text-anim-appear-active, .${prefix}-text-anim-enter-active`]: {
        opacity: 1,
      },
      [`.${prefix}-text-anim-leave`]: {
        display: 'block',
        opacity: 1,
      },
      [`.${prefix}-text-anim-leave-active`]: {
        opacity: 0,
      },

      [`.${prefix}-popup-anim-appear, .${prefix}-popup-anim-enter`]: {
        opacity: '0',
        animationPlayState: 'paused',
        // animation-timing-function: 'cubic-bezier(0.2, 0.89, 0.32, 1.28)',
        animationDuration: '200ms',
        animationFillMode: 'both',
      },
      [`.${prefix}-popup-anim-appear-active, .${prefix}-popup-anim-enter-active`]: {
        animationName: 'orca-menu-trigger-zoom-in',
        animationPlayState: 'running',
      },
      [`.${prefix}-popup-anim-leave`]: {
        animationPlayState: 'paused',
        // animation-timing-function: 'cubic-bezier(0.2, 0.89, 0.32, 1.28)',
        animationDuration: '200ms',
        animationFillMode: 'both',
      },
      [`.${prefix}-popup-anim-leave-active`]: {
        animationName: 'orca-menu-trigger-zoom-out',
        animationPlayState: 'running',
      },
      [`.${prefix}-popup-hidden`]: {
        display: 'none',
      },
      '@keyframes orca-menu-trigger-zoom-in': {
        '0%': {
          transform: 'scale(0.9)',
          opacity: '0',
        },
        '100%': {
          transform: 'scale(1, 1)',
          opacity: '1',
        },
      },
      '@keyframes orca-menu-trigger-zoom-out': {
        '0%': {
          transform: 'scale(1, 1)',
          opacity: '1',
        },
        '100%': {
          transform: 'scale(0.9)',
          opacity: '0',
        },
      },
    },
    checked: {},
    root: {
      extend: [colorTransitionStyle],
      position: 'relative',
      alignItems: 'center',
      height: '100%',

      '&$checked': {
        '& > $link': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',

          '&:after': {
            position: 'absolute',
            content: '\'\'',
            left: '0',
            bottom: '0',
            width: '100%',
            height: '3px',
            backgroundColor: '#1199ff',
            pointerEvents: 'none',
          },
        },
      },

      [`&.${prefix}-theme-light`]: {
        '& $link': {
          color: 'rgba(0, 0, 0, 0.65)',

          '&:hover': {
            color: '#33aaff',
          },
        },

        '&$root$checked': {
          '& > $link': {
            color: '#1199ff',
            backgroundColor: 'transparent',
          },
        },

        '&$vertical': {
          '&$root$checked': {
            '& > $link': {
              color: '#1199ff',
              backgroundColor: 'rgba(17, 153, 255, 0.12)',
            },
          },

          '& $link': {
            // color: 'rgba(0, 0, 0, 0.65)',

            '&:hover': {
              backgroundColor: 'transparent',
            },
          },

          // 路径上的 menu-link 颜色设为蓝色
          '&$childChecked': {
            '& > $link': {
              color: '#1199ff',

              // 浅色主题下，路径节点右侧的蓝色边去除
              '&:after': {
                display: 'none',
              },
            },
          },
        },

        /* popup */

        '&$popup': {
          backgroundColor: '#ffffff',
          boxShadow: '2px 2px 4px rgba(10, 10, 10, 0.2)',
          border: '1px solid #dddddd',

          '& > $orcaMenuSubMenu': {
            boxShadow: 'none',
            backgroundColor: '#ffffff',
          },
        },

        orcaMenuSubMenu: {
          backgroundColor: 'rgba(0, 0, 0, 0.01)',
          boxShadow: 'inset 0 3px 3px rgba(10, 10, 10, 0.1)',
        },
      },
    },

    link: {
      extend: [colorTransitionStyle],
      boxSizing: 'border-box',
      position: 'relative',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      height: '100%',
    },
    collapsed: {},
    icon: {
      width: '1em',
      height: '1em',
      lineHeight: '1em',
      marginRight: '10px',
      transition: 'transform 300ms',

      '&$collapsed': {
        transform: 'scale(1.4)',
      },
    },

    textAnimContainer: {
      flex: '1',
      overflow: 'hidden',
    },

    text: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition: 'opacity 300ms',
      fontSize: 14,
      cursor: 'inherit',
    },

    textHidden: {
      display: 'none',
    },

    childChecked: {},

    /* 垂直布局 */
    arrow: {
      width: '40px',
      height: '100%',
      cursor: 'pointer',
      flexShrink: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    vertical: {
      '& $link': {
        padding: '0',
        width: '100%',
        height: '40px',

        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
      },

      width: '100%',
      height: 'auto',

      '&$childChecked': {
        '& > $link': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',

          '&:after': {
            position: 'absolute',
            content: '\'\'',
            top: '0',
            left: 'auto',
            right: '0',
            width: '3px',
            height: '100%',
            backgroundColor: '#1199ff',
          },
        },
      },

      '&$checked': {
        '& > $link': {
          backgroundColor: '#1287e0',
          color: '#eeeeee',

          '&:hover': {
            backgroundColor: '#1199ff',
            color: '#ffffff',
          },

          '&:after': {
            position: 'absolute',
            content: '\'\'',
            top: '0',
            left: 'auto',
            right: '0',
            width: '3px',
            height: '100%',
          },
        },
      },
    },

    popup: {
      position: 'absolute !important',
      minWidth: '180px',
      backgroundColor: '#262931',
      transformOrigin: 'top left',
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
