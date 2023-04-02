import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'orca-tabs-layout';
export default createUseStyles(
  {
    root: {},

    tab: {
      height: '100%',

      '& .ant-tabs-tab-active': {
        fontWeight: '500',
      },

      '& > .ant-tabs-nav': {
        marginBottom: '0 !important',
        backgroundColor: '#ffffff',
      },

      '& > .ant-tabs-content-holder': {
        '& > .ant-tabs-content': {
          height: '100%',
        },
      },
    },

    view: {
      position: 'relative',

      '& .ant-tabs-tab': {
        userSelect: 'none',
      },
    },

    extra: {
      paddingLeft: '8px',
      paddingRight: '8px',
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
