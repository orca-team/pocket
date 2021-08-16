/**
 * title: Props
 * desc:
 *
 * title.zh-CN: 常用属性
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
import { Space, Switch } from 'antd';
import 'antd/lib/switch/style';

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

  const [useTopMenu, setUseTopMenu] = useState(false);
  const [mainMenuSide, setMainMenuSide] = useState<'left' | 'top'>('left');
  const [themeHeader, setThemeHeader] = useState<'dark' | 'light'>('dark');
  const [themeSide, setThemeSide] = useState<'dark' | 'light'>('dark');

  return (
    <div>
      <Space>
        <span>主菜单放在左侧：</span>
        <Switch
          checked={mainMenuSide === 'left'}
          onClick={(checked) => setMainMenuSide(checked ? 'left' : 'top')}
        />
        <span>顶部显示一级菜单：</span>
        <Switch
          checked={useTopMenu}
          onChange={(checked) => setUseTopMenu(checked)}
        />
        <div>提示：当主菜单放在顶部时，才能设置顶部显示一级菜单</div>
        <span>顶栏深色主题：</span>
        <Switch
          checked={themeHeader === 'dark'}
          onChange={(checked) => setThemeHeader(checked ? 'dark' : 'light')}
        />
        <span>侧边栏深色主题：</span>
        <Switch
          checked={themeSide === 'dark'}
          onChange={(checked) => setThemeSide(checked ? 'dark' : 'light')}
        />
      </Space>
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
        useTopMenu={useTopMenu}
        mainMenuSide={mainMenuSide}
        themeHeader={themeHeader}
        themeSide={themeSide}
        style={{ height: 400 }}
      >
        inner content
      </MenuLayout>
    </div>
  );
};
