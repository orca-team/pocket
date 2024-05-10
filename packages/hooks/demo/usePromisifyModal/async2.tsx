/**
 * title: 异步 onOk
 * description: 在 onOk 时，由外部执行一些异步操作，再关闭
 */
import React from 'react';
import { usePromisifyModal } from '@orca-fe/hooks';
import type { ModalProps } from 'antd';
import { Button, Form, Input, message, Modal } from 'antd';

const ef = () => {};

const apiSave = async (name: string) => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 1000);
  });
  if (Math.random() < 0.3) {
    throw new Error('500');
  }
  message.success(`Successfully saved: ${name}`);
};

const CustomModal = (props: Omit<ModalProps, 'onOk'> & { initialName?: string; onOk?: (result: string) => void }) => {
  const { initialName = '', onOk = ef } = props;
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
      <Form form={form} initialValues={{ name: initialName }}>
        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default () => {
  const modal = usePromisifyModal();

  return (
    <div>
      <Button
        onClick={async () => {
          await modal.open(
            <CustomModal
              initialName="默认名称"
              onOk={async (name) => {
                try {
                  await apiSave(name);
                } catch (error) {
                  console.error(error);
                  message.error('添加失败');
                  // 向外抛出异常，不让弹框关闭
                  throw error;
                }
              }}
            />,
          );
          message.success('已添加');
        }}
      >
        编辑
      </Button>
      {modal.instance}
    </div>
  );
};
