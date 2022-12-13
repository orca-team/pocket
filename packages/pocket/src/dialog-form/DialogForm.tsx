import React from 'react';
import pc from 'prefix-classnames';
import { Form, FormInstance, FormProps } from 'antd';
import Dialog, { DialogProps } from '../dialog';

const px = pc('dialog-form');

export interface DialogFormProps<T extends Record<string, unknown>>
  extends Omit<DialogProps, 'onOk'> {
  formProps?: Omit<FormProps<T>, 'onOk' | 'form'>;
  form?: FormInstance<T>;
  initialValues?: Partial<T>;
  onOk?: (result: T) => void;
}

function DialogForm<T extends Record<string, unknown>>(
  props: DialogFormProps<T>,
) {
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
}

DialogForm['Item'] = Form.Item;

export default DialogForm;
