import React from 'react';
import { usePromisifyModal } from '@orca-fe/hooks';
import { Button, Form, Input, message, Modal, Radio } from 'antd';

type ResultType = { name: string; type: string };

export default () => {
  const modal = usePromisifyModal();

  const handleClick = async () => {
    let result: ResultType | undefined = undefined;
    await modal.show(
      <Modal title="添加商品">
        <Form<ResultType>
          onValuesChange={(_, v) => {
            result = v;
          }}
        >
          <Form.Item label="商品名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item label="商品类型" name="type" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio.Button value="1">电子产品</Radio.Button>
              <Radio.Button value="2">办公用品</Radio.Button>
              <Radio.Button value="3">日用品</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>,
    );
    if (result) {
      message.success(`成功添加了：${result.name} 类型：${result.type}`);
    }
  };

  return (
    <div>
      <Button onClick={handleClick}>添加商品</Button>
      {modal.instance}
    </div>
  );
};
