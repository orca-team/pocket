/**
 * title: Default usage
 * desc:
 *
 * title.zh-CN: 基础用法
 * desc.zh-CN:
 */
import React, { useState } from 'react';
import { MenuItemType, MenuLayout } from '@orca-fe/pocket';
import {
  ApiOutlined,
  HomeOutlined,
  QuestionOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Switch } from 'antd';

// 菜单配置
const menu: MenuItemType[] = [
  {
    key: '/home',
    path: '/home',
    icon: <HomeOutlined />,
    text: '首页',
  },
  {
    key: '/api',
    path: '/api',
    icon: <ApiOutlined />,
    text: 'API',
    children: [
      {
        key: '/api/get-user',
        path: '/api/get-user',
        text: '获取用户信息',
        children: [
          {
            key: '/api/get-user/detail',
            path: '/api/get-user/detail',
            text: '用户详情',
            visible: false,
          },
        ],
      },
      {
        key: '/api/add-user',
        path: '/api/add-user',
        text: '添加用户信息',
      },
      {
        key: '/api/update-user',
        path: '/api/update-user',
        text: '更新用户信息',
      },
    ],
  },
  {
    key: '/setting',
    path: '/setting',
    icon: <SettingOutlined />,
    text: '设置',
  },
  {
    key: '/about',
    path: '/about',
    icon: <QuestionOutlined />,
    text: '关于',
    visible: true,
  },
];

export default () => {
  // 模拟 location.pathname (实际使用时，不需要设置 pathname)
  const [pathname, setPathname] = useState('/home');

  return (
    <div>
      <MenuLayout
        title={'标题'}
        menu={menu}
        /* 实际使用时不需要设置 pathname */
        pathname={pathname}
        onItemClick={(e, info) => {
          // 仅在Demo使用，禁止默认点击行为（路由跳转）
          e.preventDefault();
          if (info.path) setPathname(info.path);
        }}
        style={{ height: 400 }}
      >
        inner content
      </MenuLayout>
    </div>
  );
};
