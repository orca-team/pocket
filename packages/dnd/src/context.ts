import { createContext } from 'react';
import KeyManager from './KeyManager';

export type SortableHelperContextType = {
  keys: string[];
  keyManager: KeyManager<any>;
  data: any[];
  customHandle: boolean;
  activeItem: any;
  activeIndex: number;
  activeIndexPath: number[];
};
export const SortableHelperContext = createContext<SortableHelperContextType>({
  keys: [],
  keyManager: new KeyManager(),
  data: [],
  customHandle: false,
  activeItem: undefined,
  activeIndex: -1,
  activeIndexPath: [],
});
