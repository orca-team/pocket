import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'custom-breadcrumb';
export default createUseStyles(
  {
    root: {
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'default',
      '& a': {
        cursor: 'pointer',
        color: '#999999',
      },
      [`& ${prefix}-default-seperator`]: {
        margin: '0 8px',
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
