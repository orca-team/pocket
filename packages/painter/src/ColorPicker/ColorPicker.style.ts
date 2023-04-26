import { createUseStyles } from '@orca-fe/simple-jss';
import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';

const prefix = 'color-picker';

export default createUseStyles(
  {
    '@global': {
      '.rc-trigger-popup': {
        position: 'absolute',
        top: -9999,
        left: -9999,
        zIndex: 1050,
        animationDuration: '0.3s',
        animationFillMode: 'both',
      },
      '.rc-trigger-popup-hidden': {
        display: 'none',
      },
    },
    wrapper: {
      '& .sketch-picker': {
        border: '1px solid #0081ff',
        backgroundColor: '#2f343b !important',

        '& > div:nth-child(2)': {
          '& > div:nth-child(2)': {
            border: '1px solid #AAAAAA',
          },
        },
        '& > div:nth-child(3)': {
          '& span': {
            color: '#EEEEEE !important',
          },
          '& input': {
            boxShadow: 'rgb(46, 46, 46) 0px 0px 0px 1px inset !important',
            backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
            color: '#EEEEEE !important',
          },
        },
      },
    },
    prefixPreview: {
      position: 'relative',
      cursor: 'pointer',
      padding: 4,
      '&:active': {
        filter: 'brightness(0.95)',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
      },
    },
    prefixPreviewColor: {
      height: '100%',
    },
    colorPickerContainer: {
      padding: '16px',
      boxShadow: '0 0 12px rgba(125, 125, 125, 0.3)',
      backgroundColor: '#222222',
      borderRadius: '12px',

      '& .react-colorful__pointer': {
        width: 18,
        height: 18,
      },
    },
    colorDef: {
      width: 24,
      height: 24,
      borderRadius: 4,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '&:hover': {
        outline: '1px solid #1199ff',
      },
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
