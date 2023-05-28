/**
 * title: 错误信息
 * description: 这里模拟接口会返回错误信息的情况
 */
import React, { useState } from 'react';
import { useService } from '@orca-fe/hooks';
import { Alert, Button, Input, message, Space, Spin } from 'antd';
import { postWithError } from '../mockService';

export default () => {
  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  const saveInfoService = useService(postWithError, {
    manual: true, // 手动发起请求，默认不请求
    onSuccess: (res) => {
      message.success('提交成功');
    },
    onError: (err) => {
      // 在 onError 中处理网络/非业务错误（如：数据库连接失败，超时等）
      message.error(err.message);
    },
    onFinish: (result) => {
      // 在 onFinish 中处理业务错误信息
      if (!result.success) {
        message.warning(result.errMsg);
      }
    },
  });

  return (
    <div>
      <h3>提交信息接口报错测试（50%概率报错）</h3>
      {saveInfoService.error && <Alert message="提交失败，请重试" type="error" style={{ marginBottom: 12 }} />}
      <Spin spinning={saveInfoService.loading}>
        <Space>
          <Input
            placeholder="请输入内容"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              saveInfoService.run({ info: keyword });
            }}
          >
            提交
          </Button>
        </Space>
      </Spin>
    </div>
  );
};
