import React from 'react';
import type { Point } from './utils';

export type TransformerBoxContextType = {
  getPointMapping: (p: Point) => Point;
};
const TransformerBoxContext = React.createContext<TransformerBoxContextType>({
  getPointMapping: p => p,
});

export default TransformerBoxContext;
