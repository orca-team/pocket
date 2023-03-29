import jssAutoPrefix from '@orca-fe/jss-plugin-auto-prefix';
import { createUseStyles } from '../utils/jss';

const prefix = 'resizable-wrapper';

const handleStyle = {
  position: 'absolute',
  opacity: '0',
  backgroundColor: '#1199ff',
  transition: 'opacity 500ms',
  '&:hover, &$dragging': {
    transitionDelay: '500ms',
    opacity: '1',
  },
  '&:active': {
    transition: 'opacity 100ms',
    transitionDelay: '0ms',
  },
};
export default createUseStyles(
  {
    root: {
      position: 'relative',
      flexShrink: 1000,
    },
    dragHandle: {
      zIndex: 1,
    },
    dragging: {},
    handleVertical: {
      extend: handleStyle,
      bottom: '0',
      left: '0',
      width: '100%',
      height: '4px',
      cursor: 'ns-resize',
    },
    handleVerticalTop: {
      top: '0',
      bottom: 'auto',
    },
    handleHorizontal: {
      extend: handleStyle,
      right: '0',
      top: '0',
      height: '100%',
      width: '4px',
      cursor: 'ew-resize',
    },
    handleHorizontalLeft: {
      left: '0',
      right: 'auto',
    },
  },
  {
    classNamePrefix: prefix,
    plugins: [jssAutoPrefix({ prefix })],
  },
);
