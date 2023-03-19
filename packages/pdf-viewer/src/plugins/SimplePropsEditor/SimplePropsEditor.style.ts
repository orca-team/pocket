import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'simple-props-editor';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      minWidth: 200,
      gap: '0 12px',
      alignItems: 'center',
      padding: [4, 0, 4, 12],
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
