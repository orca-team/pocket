import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'painter-toolbar';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      '& .orca-icon-button-checked': {
        backgroundColor: '#CCC',
      },
    },
    wrapper: {
      '& .orca-icon-button-checked': {
        backgroundColor: '#CCC',
      },
    },
    toolbar: {
      backgroundColor: '#eeeeee',
      padding: '0 4px',
      border: '1px solid #DDD',
      minWidth: 200,
      height: 40,
      display: 'flex',
      alignItems: 'center',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
