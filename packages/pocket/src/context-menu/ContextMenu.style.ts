import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import type { JssStyle } from 'jss';
import { createUseStyles } from '../utils/jss';

const prefix = 'context-menu';
const styleNoWrap = {
  position: 'relative',
  whiteSpace: 'nowrap',
  height: 30,
};
const styleCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
export default createUseStyles(
  {
    root: {
      position: 'relative',
    },
    wrapper: {
      position: 'fixed',
      transition: 'opacity 300ms',
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      zIndex: 10000,
    },
    container: {
      position: 'fixed',
      minWidth: 200,
      userSelect: 'none',
      padding: 5,
      borderRadius: 4,
      backgroundColor: '#ffffff',
      boxShadow: '0px 1px 5px 1px rgba(80, 80, 80, 0.45)',
      color: 'rgba(0, 0, 0, 0.85)',
    },
    splitLine: {
      paddingLeft: 5,
      paddingRight: 5,
      margin: '4px 0',
      '&:after': {
        display: 'block',
        borderTop: '1px solid #dddddd',
        content: '\'\'',
        position: 'relative',
      },
    },
    item: {
      position: 'relative',
      borderRadius: 4,
      padding: '0 5px',
      display: 'flex',
      alignItems: 'center',
      '&:not(.context-menu-disabled)': {
        '&:hover': {
          backgroundColor: 'rgba(125, 125, 125, 0.25)',
        },
      },
    },
    disabled: {
      opacity: 0.4,
    },
    text: {
      extend: styleNoWrap,
      display: 'flex',
      alignItems: 'center',
      flex: 1,
    },
    icon: {
      extend: [styleNoWrap, styleCenter] as JssStyle,
      width: 25,
    },
    arrow: {
      extend: [styleNoWrap, styleCenter] as JssStyle,
      width: 25,
    },
    extra: {
      extend: [styleNoWrap, styleCenter] as JssStyle,
      color: 'rgba(0, 0, 0, 0.45)',
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
