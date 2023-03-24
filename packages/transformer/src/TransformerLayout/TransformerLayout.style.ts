import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'orca-transformer-layout';

export default createUseStyles(
  {
    root: {
      position: 'relative',
      height: 200,
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
