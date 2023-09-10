import React, { useState } from 'react';
import { Form, Input, Button, Space, notification } from 'antd';
import { FormCollection } from '@orca-fe/antd-plus';

const Demo = () => {
  const [formCollection] = FormCollection.useFormCollection();

  const [allFormValues, setAllFormValues] = useState<string>();

  // 获取所有表单数据
  const getAllFormValues = () => {
    const forms = formCollection.getForms();
    const values: string[] = [];
    Object.entries(forms).forEach(([formName, form]) => {
      values.push(
        JSON.stringify({
          formName,
          formValues: form.getFieldsValue(),
        }),
      );
    });

    setAllFormValues(values.join('\n'));
  };

  // 校验所有表单
  const validateAllForm = async () => {
    const { errorForms } = await formCollection.validateForms();

    if (errorForms.length > 0) {
      const formNames = errorForms.map(it => it.formName).join('\n');
      notification.error({ message: '以下表单未通过校验，请检查', description: <pre>{formNames}</pre> });
    }
  };

  return (
    <FormCollection formCollection={formCollection}>
      {new Array(5).fill(0)
        .map((_, index) => (
          <div key={index}>
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>{`form-${index + 1}`}</div>
            {/* 包裹你需要控制的 Form 组件，并赋予它一个名称 */}
            <FormCollection.Control name={`form-${index + 1}`}>
              <Form>
                <Form.Item name={`input-${index + 1}`} label={`Input-${index + 1}`} rules={[{ required: true }]}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Form>
            </FormCollection.Control>
          </div>
        ))}

      <Space>
        <Button
          onClick={() => {
            getAllFormValues();
          }}
        >
          获取所有表单数据
        </Button>
        <Button
          onClick={() => {
            validateAllForm();
          }}
        >
          校验所有表单
        </Button>
      </Space>
      {allFormValues && <pre>{allFormValues}</pre>}
    </FormCollection>
  );
};

export default Demo;
