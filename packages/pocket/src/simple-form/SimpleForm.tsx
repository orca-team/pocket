import type { ReactElement, ReactNode } from 'react';
import React, { cloneElement, createContext, isValidElement, useContext, useEffect, useMemo, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { get, pick, set } from 'lodash-es';
import produce from 'immer';
import CommonStore from '../common-store';

const ef = () => {};

type NamePath = string | string[];

class FormStore<T = any> extends CommonStore<any> {
  constructor() {
    super({});
  }

  setFieldsValue(value: Partial<T>) {
    this.setState(value);
  }

  setFieldValue(key: NamePath, value: any) {
    this.setState(
      produce(this.getState(), (state) => {
        set(state, key, value);
      }),
    );
    return pick(this.getState(), [key]);
  }

  getFieldsValue() {
    return this.getState() as T;
  }

  getFieldValue(key: NamePath) {
    return get(this.getState(), key);
  }
}

export type SimpleFormContextType = {
  form: FormStore;
  changeValue: (key: NamePath, value: any) => void;
};

export const SimpleFormContext = createContext<SimpleFormContextType>({
  form: new FormStore(),
  changeValue: () => {},
});

const useForm = (_form?: FormStore) => {
  const [form] = useState(() => _form || new FormStore());
  return [form];
};

export interface SimpleFormProps<T extends Record<string, any>> {
  initialValues?: Partial<T>;
  onValuesChange?: (changed: Partial<T>, value: T) => void;
  children?: ReactNode;
  form?: FormStore<T>;
}

const SimpleForm = <T extends Record<string, any>>(props: SimpleFormProps<T>) => {
  const { initialValues, form: formFromProps, onValuesChange = ef, children } = props;

  const [form] = useForm(formFromProps);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, []);

  const changeValue = useMemoizedFn((fieldName: NamePath, value: any) => {
    const changedValue = form.setFieldValue(fieldName, value);
    // trigger events
    onValuesChange(changedValue as Partial<T>, form.getFieldsValue());
  });

  return <SimpleFormContext.Provider value={useMemo(() => ({ form, changeValue }), [])}>{children}</SimpleFormContext.Provider>;
};

export default SimpleForm;

function defaultGetValueFromEvent(valuePropName: string, event: any) {
  if (event?.target && typeof event.target === 'object' && valuePropName in event.target) {
    return (event.target as HTMLInputElement)[valuePropName];
  }

  return event;
}

const eArr = [];

export type SimpleFormItemProps = {
  name?: NamePath;
  valuePropName?: string;
  trigger?: string;
  children?: ReactElement;
};

const SimpleFormItem = (props: SimpleFormItemProps) => {
  const { children, valuePropName = 'value', trigger = 'onChange', name = eArr } = props;
  const childProps = children?.props;
  const originTriggerFunc: any = childProps?.[trigger];

  const { form, changeValue } = useContext(SimpleFormContext);

  const value = form.useState(state => get(state, name));
  const triggerFn = useMemoizedFn((...args: any[]) => {
    const newValue = defaultGetValueFromEvent(valuePropName, args[0]);
    if (name) {
      changeValue(name, newValue);
    }
    originTriggerFunc?.(...args);
  });
  if (name && isValidElement(children)) {
    return cloneElement(children, {
      [valuePropName]: value,
      [trigger]: triggerFn,
    });
  }

  return <>{children}</>;
};

SimpleForm.useForm = useForm;
SimpleForm.Item = SimpleFormItem;
SimpleForm.Context = SimpleFormContext;
SimpleForm.useFormInstance = () => useContext(SimpleFormContext).form;
