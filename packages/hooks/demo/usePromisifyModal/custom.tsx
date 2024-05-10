/**
 * title: 自定义弹窗
 * description: 自定义弹窗指的是，你可以基于`Modal`封装属于自己的弹框组件，将复杂的业务逻辑放在弹框组件内部实现，只要对外仍保留 visible/onOk/onCancel 属性即可。
 */
import React from 'react';
import { usePromisifyModal } from '@orca-fe/hooks';
import type { ModalProps } from 'antd';
import { Alert, Button, Form, Input, message, Modal } from 'antd';

const ef = () => {};

// 这是一个简单的自定义弹框组件
const CustomModal = (props: Omit<ModalProps, 'onOk'> & { onOk?: (name: string) => void }) => {
  const { onOk = ef } = props;
  const [form] = Form.useForm();
  return (
    <Modal
      title="新增"
      {...props}
      onOk={async () => {
        const result = await form.validateFields();
        onOk(result.name);
      }}
    >
      <Form form={form}>
        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
      </Form>
      <Alert message="请注意：在封装自定义 Modal 时，为了确保弹窗状态能够被正确接管，请将 visible/onOk/onCancel 属性传递至 Modal 上。或者像本例中使用属性透传的方式。" />
    </Modal>
  );
};

export default () => {
  const modal = usePromisifyModal();

  return (
    <div>
      <Button
        onClick={async () => {
          const name = await modal.open<string>(<CustomModal />);
          message.success(`已添加：${name}`);
        }}
      >
        新增
      </Button>
      {modal.instance}
    </div>
  );
};
