import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'pdf-painter-plugin';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
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
    painter: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      '&$drawing': {
        zIndex: 10,
      },
    },
    drawing: {
      '&:hover': {
        outline: '2px solid #19f',
      },
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
