/**
 * title: With MenuLayout
 * desc:
 *
 * title.zh-CN: 在 MenuLayout 内部
 * desc.zh-CN:
 */
import React, { useState } from 'react';
import { CustomBreadcrumb, MenuItemType, MenuLayout } from '@orca-fe/pocket';
import { ApiOutlined, HomeOutlined, QuestionOutlined, SettingOutlined } from '@ant-design/icons';

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
        icon: <ApiOutlined />,
      },
      {
        key: '/api/add-user',
        path: '/api/add-user',
        text: '添加用户信息',
        icon: <ApiOutlined />,
      },
      {
        key: '/api/update-user',
        path: '/api/update-user',
        text: '更新用户信息',
        icon: <ApiOutlined />,
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
  },
];

export default () => {
  // 模拟 location.pathname (实际使用时，不需要设置 pathname)
  const [pathname, setPathname] = useState('/home');


  return (
    <div>
      <MenuLayout
        title="标题"
        menu={menu}
        // 实际使用时不需要设置 pathname
        pathname={pathname}
        onItemClick={(e, info) => {
          // 仅在Demo使用，禁止默认点击行为（路由跳转）
          e.preventDefault();
          if (info.path) setPathname(info.path);
        }}
        style={{ height: 400 }}
      >
        <div>
          <CustomBreadcrumb.Renderer />
        </div>
        inner content
      </MenuLayout>
    </div>
  );
};
