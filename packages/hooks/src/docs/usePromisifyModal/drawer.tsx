import React from 'react';
import { usePromisifyDrawer } from '@orca-fe/hooks';
import { Button, Drawer, DrawerProps, Form, Input, message } from 'antd';

const ef = () => {};

const CustomDrawer = (
  props: DrawerProps & { onOk?: (res: string) => void },
) => {
  const { onOk = ef, ...otherProps } = props;
  const [form] = Form.useForm();
  return (
    <Drawer
      title="添加"
      {...otherProps}
      footer={
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            form.validateFields().then((res) => {
              onOk(res.name);
            });
          }}
        >
          确认
        </Button>
      }
    >
      <Form
        form={form}
        onFinish={(value) => {
          onOk(value.name);
        }}
      >
        <Form.Item label="名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default () => {
  const drawer = usePromisifyDrawer();
  const handleClick = () => {
    drawer.show(<Drawer title="标题">Drawer 的内容</Drawer>);
  };
  const customDrawer = usePromisifyDrawer({
    onOkField: 'onOk',
  });
  const handleCustomClick = async () => {
    const res = await customDrawer.show<string>(<CustomDrawer />);

    message.info(`成功添加了：${res}`);
  };
  return (
    <div>
      <Button onClick={handleClick}>打开侧边栏</Button>
      <Button onClick={handleCustomClick}>新增（自定义侧边栏）</Button>
      {drawer.instance}
      {customDrawer.instance}
    </div>
  );
};
