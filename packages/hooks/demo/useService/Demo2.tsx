/**
 * title: 表格分页
 * description: 这里展示，如何将分页参数传递给接口
 */
import React, { useState } from 'react';
import { useService } from '@orca-fe/hooks';
import { Input, Table } from 'antd';
import { useDebounceEffect } from 'ahooks';
import { getUserListPagination } from '../mockService';

export default () => {
  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  const getUserListService = useService(getUserListPagination);
  const result = getUserListService.data || { list: [], totalCount: 0, pageIndex: 1, pageSize: 10 };

  // 延迟触发搜索
  useDebounceEffect(
    () => {
      getUserListService.run({ name: keyword, pageSize: result.pageSize });
    },
    [keyword],
    { wait: 500 },
  );

  return (
    <div>
      <h3>查找列表（服务端分页）</h3>
      <Input
        placeholder="过滤姓名"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
      />
      <Table
        size="small"
        loading={getUserListService.loading}
        dataSource={result.list}
        pagination={{
          pageSizeOptions: ['5', '10', '15', '20'],
          showTotal: total => `共 ${total} 条`,
          showSizeChanger: true,
          showQuickJumper: true,
          current: result.pageIndex,
          pageSize: result.pageSize,
          total: result.totalCount,
          onChange: (pageIndex, pageSize) => {
            getUserListService.run({ name: keyword, pageIndex, pageSize });
          },
        }}
      >
        <Table.Column title="姓名" dataIndex="name" />
        <Table.Column title="年龄" dataIndex="age" />
        <Table.Column title="性别" dataIndex="gender" />
      </Table>
    </div>
  );
};
