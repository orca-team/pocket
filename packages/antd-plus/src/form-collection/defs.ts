import type { FormInstance } from 'antd';

export type StoreValue = FormInstance;
export type Store = Record<string, StoreValue>;

export type ValidateSuccessForm = {
  formName: string;
  formValues: any;
};

export type ValidateErrorForm = {
  formName: string;
  errorInfo: any;
};

export type ValidateFormResult = {
  successForms: ValidateSuccessForm[];
  errorForms: ValidateErrorForm[];
};

export type FormCollectionInstance = {
  getForm: <Values = any>(formName: string) => FormInstance<Values>;
  getForms: (formNameList?: string[]) => Record<string, FormInstance>;
  validateForm: <Values = any>(formName: string) => Promise<Values> | null;
  validateForms: (formNameList?: string[]) => Promise<ValidateFormResult>;
};

export const INTERNAL_HOOK_SECRET = 'INTERNAL_HOOK_SECRET';

export interface FormCollectionInternalHooks {
  setForm: (formName: string, form: FormInstance) => void;
  removeForm: (formName) => void;
}

export type InternalFormCollectionInstance = FormCollectionInstance & {
  getInternalHooks: (secret: string) => FormCollectionInternalHooks | null;
};
