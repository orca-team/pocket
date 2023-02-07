import React from 'react';
import pc from 'prefix-classnames';
import type { FormInstance, FormProps } from 'antd';
import { Form } from 'antd';
import type { DialogProps } from '../dialog';
import Dialog from '../dialog';

const px = pc('dialog-form');

export interface DialogFormProps<T extends Record<string, unknown>>
  extends Omit<DialogProps, 'onOk'> {
  formProps?: Omit<FormProps<T>, 'onOk' | 'form'>;
  form?: FormInstance<T>;
  initialValues?: Partial<T>;
  onOk?: (result: T) => void;
}

const DialogForm = <T extends Record<string, unknown>>(
  props: DialogFormProps<T>,
) => {
  const {
    className = '',
    children,
    formProps,
    initialValues,
    form: formFromProps,
    onOk,
    ...otherProps
  } = props;

  const [form] = Form.useForm(formFromProps);
  return (
    <Dialog
      className={`${px('root')} ${className}`}
      {...otherProps}
      onOk={async () => {
        form.submit();
      }}
    >
      <Form<T>
        initialValues={initialValues}
        preserve
        size="middle"
        layout="vertical"
        {...formProps}
        form={form}
        onFinish={(result) => {
          formProps?.onFinish?.(result);
          onOk?.({
            ...initialValues,
            ...result,
          });
        }}
      >
        {children}
      </Form>
    </Dialog>
  );
};

export default DialogForm;
