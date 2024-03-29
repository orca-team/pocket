import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'zoom-and-page-controller';

export default createUseStyles(
  {
    root: {
      padding: [12, 16],
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: 4,
      display: 'flex',
      gap: 4,
      color: '#fff',
      whiteSpace: 'nowrap',
      alignItems: 'baseline',
      '& .ant-input': {
        color: '#fff',
      },

      '& .simple-number-input-editable': {
        color: '#fff',
        textDecoration: 'none',
      },
    },
    input: {
      fontSize: 16,
      paddingTop: 0,
      paddingBottom: 0,
      border: '1px solid #999',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      borderRadius: 4,
      color: '#fff',
      outline: 'none',
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
