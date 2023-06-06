import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '@orca-fe/simple-jss';

const prefix = 'zoom-editor';
export default createUseStyles(
  {
    root: {
      padding: '2px 4px',
      borderRadius: '4px',

      '& $text': {
        color: 'inherit',
        textDecoration: 'none',
      },
    },
    zoomControl: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      marginLeft: '4px',
      marginRight: '4px',
    },
    text: {},
    icon: {
      cursor: 'pointer',
    },
    menu: {
      position: 'relative',
      '& > *': {
        cursor: 'pointer',
        padding: [2, 8],
        borderRadius: 4,
        textAlign: 'center',
        '&:hover': {
          backgroundColor: 'rgba(125,125,125,0.5)',
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
