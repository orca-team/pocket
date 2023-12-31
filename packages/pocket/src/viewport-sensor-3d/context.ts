import { createContext } from 'react';
import type { Viewport3dType } from './Viewport3d';

export type Viewport3dContextType = {
  viewport: Viewport3dType;
};

export const Viewport3dContext = createContext<Viewport3dContextType>({
  viewport: {
    left: 0,
    top: 0,
    zoom: 0,
    rotate: 0,
    pitch: 0,
  },
});
