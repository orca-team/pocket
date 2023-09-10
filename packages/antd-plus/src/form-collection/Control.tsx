import { Form } from 'antd';
import type { ReactNode } from 'react';
import React from 'react';
import { useMount, useUnmount } from 'ahooks';
import { FormCollectionContext } from './context';
import type { InternalFormCollectionInstance } from './defs';
import { INTERNAL_HOOK_SECRET } from './defs';

export interface FormCollectionControlProps {

  /** Form 表单名称 */
  name: string;

  /** Form 表单组件 */
  children: ReactNode;
}

const Control = (props: FormCollectionControlProps) => {
  const { name, children } = props;
  const { formCollection } = React.useContext(FormCollectionContext);
  const { setForm, removeFrom } = (formCollection as InternalFormCollectionInstance).getInternalHooks(INTERNAL_HOOK_SECRET)!;

  const [form] = Form.useForm();

  useMount(() => {
    setForm(name, form);
  });

  useUnmount(() => {
    removeFrom(name);
  });

  return React.isValidElement(children) ? React.cloneElement<any>(children, { form }) : <>{children}</>;
};

export default Control;
