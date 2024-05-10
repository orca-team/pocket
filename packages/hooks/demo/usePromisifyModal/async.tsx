/**
 * title: 异步弹窗
 * description: 在 onOk 时，弹窗组件自己完成异步操作，并等待接口完成再关闭
 */
import React, { useState } from 'react';
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

const CustomModal = (props: Omit<ModalProps, 'onOk'> & { initialName?: string; onOk?: (result: { success: boolean; data: string }) => void }) => {
  const { initialName = '', onOk = ef } = props;
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <Modal
      title="新增"
      {...props}
      confirmLoading={confirmLoading}
      onOk={async () => {
        const result = await form.validateFields();
        setConfirmLoading(true);
        try {
          await apiSave(result.name);
          onOk({
            success: true,
            data: result.name,
          });
        } catch (err) {
          console.error('Save Failed', err);
          message.error('Save Failed');
        } finally {
          setConfirmLoading(false);
        }
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
          const result = await modal.open<{ success: boolean; data: string }>(<CustomModal initialName="默认名称" />);
          message.success(`Save 状态：${result.success}`);
        }}
      >
        编辑
      </Button>
      {modal.instance}
    </div>
  );
};
