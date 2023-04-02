import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '@orca-fe/simple-jss';

const prefix = 'zoom-editor';
export default createUseStyles(
  {
    root: {
      padding: '2px 4px',
      backgroundColor: '#eee',
      borderRadius: '4px',
    },
    zoomControl: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      marginLeft: '4px',
      marginRight: '4px',
    },
    text: {
      color: 'inherit',
      textDecoration: 'none',
    },
    icon: {
      cursor: 'pointer',
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
