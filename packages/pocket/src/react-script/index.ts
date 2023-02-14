import ReactScript from './ReactScript';
import withScript from './hoc';

ReactScript['withScript'] = withScript;

export default ReactScript as typeof ReactScript & {
  withScript: typeof withScript;
};
