import React from 'react';
import pc from 'prefix-classnames';
import type { FormInstance, FormProps, ModalProps } from 'antd';
import { Form, Modal } from 'antd';

const px = pc('modal-form');

export interface ModalFormProps<T extends Record<string, unknown>> extends Omit<ModalProps, 'onOk'> {
  formProps?: Omit<FormProps<T>, 'onOk' | 'form'>;
  form?: FormInstance<T>;
  initialValues?: Partial<T>;
  onOk?: (result: T) => void;
}

const ModalForm = <T extends Record<string, unknown>>(props: ModalFormProps<T>) => {
  const { className = '', children, formProps, initialValues, form: formFromProps, onOk, ...otherProps } = props;

  const [form] = Form.useForm(formFromProps);
  return (
    <Modal
      className={`${px('root')} ${className}`}
      {...otherProps}
      okButtonProps={{ size: 'middle' }}
      cancelButtonProps={{ size: 'middle' }}
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
    </Modal>
  );
};

export default ModalForm;
