/**
 * title: 基础用法
 * description: 这里介绍将结果接入表格的示例
 */
import React, { useState } from 'react';
import { useService } from '@orca-fe/hooks';
import { Input, Table } from 'antd';
import { useDebounceEffect } from 'ahooks';
import { getUserList } from '../mockService';

export default () => {
  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  const getUserListService = useService(getUserList);
  const dataSource = getUserListService.data || [];

  // 延迟触发搜索
  useDebounceEffect(
    () => {
      getUserListService.run({ name: keyword });
    },
    [keyword],
    { wait: 500 },
  );

  return (
    <div>
      <h3>查找列表（本地分页）</h3>
      <Input
        placeholder="过滤姓名"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
      />
      <Table size="small" loading={getUserListService.loading} dataSource={dataSource}>
        <Table.Column title="姓名" dataIndex="name" />
        <Table.Column title="年龄" dataIndex="age" />
        <Table.Column title="性别" dataIndex="gender" />
      </Table>
    </div>
  );
};
