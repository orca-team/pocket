import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'zoom-and-page-controller';

export default createUseStyles(
  {
    root: {
      padding: [0, 16],
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      height: 40,
      color: '#fff',

      '& .simple-number-input-editable': {
        color: '#fff',
        textDecoration: 'none',
      },
    },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      border: 'none',
      borderRadius: 4,
      color: '#fff',
    },
    zoomEditor: {
      marginLeft: 8,
      padding: [0, 8],
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
