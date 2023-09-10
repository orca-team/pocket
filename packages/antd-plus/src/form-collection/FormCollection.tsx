import type { Key, ReactNode } from 'react';
import React from 'react';
import Control from './Control';
import { FormCollectionContext } from './context';
import type { FormCollectionInstance } from './defs';
import useFormCollection from './hooks/useFormCollection';
import useFormCollectionInstance from './hooks/useFormCollectionInstance';

export interface FormCollectionProps {

  /** React Key */
  key?: Key;

  /** FormCollection 组件实例 */
  formCollection?: FormCollectionInstance;

  /** 组件元素 */
  children?: ReactNode;
}

const FormCollection = (props: FormCollectionProps) => {
  const { key, formCollection, children } = props;

  const [formCollectionInstance] = useFormCollection(formCollection);

  return (
    <FormCollectionContext.Provider key={key} value={{ formCollection: formCollectionInstance }}>
      {React.isValidElement(children) ? children : <>{children}</>}
    </FormCollectionContext.Provider>
  );
};

FormCollection.Control = Control;
FormCollection.useFormCollection = useFormCollection;
FormCollection.useFormCollectionInstance = useFormCollectionInstance;

export default FormCollection;
