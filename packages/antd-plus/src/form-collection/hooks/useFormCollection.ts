import { omit, pick } from 'lodash-es';
import type { FormInstance } from 'antd';
import { useRef } from 'react';
import { INTERNAL_HOOK_SECRET } from '../defs';
import type {
  FormCollectionInternalHooks,
  FormCollectionInstance,
  InternalFormCollectionInstance,
  Store,
  ValidateSuccessForm,
  ValidateErrorForm,
} from '../defs';

export class FormCollectionStore {
  private store: Store = {};

  public getFormCollection = (): InternalFormCollectionInstance => ({
    getForm: this.getForm,
    getForms: this.getForms,
    validateForm: this.validateForm,
    validateForms: this.validateForms,

    getInternalHooks: this.getInternalHooks,
  });

  // ============== FormCollection Public Hooks ==============
  private readonly getForms = (formNameList?: string[]) => {
    if (typeof formNameList === 'undefined') return this.store;

    return pick(this.store, formNameList);
  };

  private readonly getForm = (formName: string) => this.store[formName];

  private readonly validateForms = async (formNameList?: string[]) => {
    const keys = typeof formNameList === 'undefined' ? Object.keys(this.store) : formNameList;
    const successForms: ValidateSuccessForm[] = [];
    const errorForms: ValidateErrorForm[] = [];

    for (let index = 0; index < keys.length; index++) {
      const formName = keys[index];
      const form = this.store[formName];

      if (!form) continue;

      try {
        const formValues = await form.validateFields();
        successForms.push({
          formName,
          formValues,
        });
      } catch (errorInfo) {
        errorForms.push({
          formName,
          errorInfo,
        });
      }
    }

    return {
      successForms,
      errorForms,
    };
  };

  private readonly validateForm = (formName: string) => {
    const form = this.store[formName];

    return form ? form.validateFields() : null;
  };

  // ============== FormCollection Internal Hooks ==============
  private readonly getInternalHooks = (secret?: string): FormCollectionInternalHooks | null => {
    if (secret === INTERNAL_HOOK_SECRET) {
      return {
        setForm: this.setForm,
        removeForm: this.removeForm,
      };
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn('`getInternalHooks` is internal usage. Should not call directly.');
    }

    return null;
  };

  private readonly setForm = (formName: string, form: FormInstance) => {
    this.updateStore({ ...this.store, [formName]: form });
  };

  private readonly removeForm = (formName: string) => {
    this.updateStore(omit(this.store, [formName]));
  };

  // ============== Store ==============
  private readonly updateStore = (store: Store) => {
    this.store = store;
  };
}

function useFormCollection(formCollection?: FormCollectionInstance) {
  const formCollectionRef = useRef<FormCollectionInstance>();

  if (!formCollectionRef.current) {
    if (formCollection) {
      formCollectionRef.current = formCollection;
    } else {
      const formCollectionStore: FormCollectionStore = new FormCollectionStore();
      formCollectionRef.current = formCollectionStore.getFormCollection();
    }
  }

  return [formCollectionRef.current];
}

export default useFormCollection;
