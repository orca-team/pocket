import { createContext } from 'react';
import type { FormCollectionInstance } from './defs';

export interface FormCollectionContextProps {
  formCollection?: FormCollectionInstance;
}

export const FormCollectionContext = createContext<FormCollectionContextProps>({});
