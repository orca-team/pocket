import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'error-catcher';
export default createUseStyles(
  {
    root: {
      border: '2px dashed #cc3333',
      padding: '5px 10px',
      margin: '5px',
      color: '#600',
      backgroundColor: '#ffaaaa',
      height: '100%',
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
