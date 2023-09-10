import { useContext } from 'react';
import { FormCollectionContext } from '../context';
import type { FormCollectionInstance } from '../defs';

function useFormCollectionInstance(): FormCollectionInstance {
  const { formCollection } = useContext(FormCollectionContext);

  return formCollection!;
}

export default useFormCollectionInstance;
