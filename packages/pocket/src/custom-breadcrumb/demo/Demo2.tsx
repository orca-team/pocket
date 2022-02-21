/**
 * title: With MenuLayout
 * desc:
 *
 * title.zh-CN: 在 MenuLayout 内部
 * desc.zh-CN:
 */
import React, { useState } from 'react';
import { CustomBreadcrumb, MenuItemType, MenuLayout } from '@orca-fe/pocket';
import { ApiOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Skeleton } from 'antd';
import 'antd/dist/antd.css';

// 菜单配置
const menu: MenuItemType[] = [
  {
    key: '/home',
    path: '/home',
    icon: <HomeOutlined />,
    text: '首页',
  },
  {
    key: '/mgr',
    path: '/mgr',
    icon: <ApiOutlined />,
    text: '管理',
    children: [
      {
        key: '/mgr/get-user',
        path: '/mgr/get-user',
        text: '用户列表',
        icon: <ApiOutlined />,
      },
      {
        key: '/mgr/add-user',
        path: '/mgr/add-user',
        text: '添加用户信息',
        icon: <ApiOutlined />,
      },
      {
        key: '/mgr/update-user',
        path: '/mgr/update-user',
        text: '更新用户信息',
        icon: <ApiOutlined />,
      },
    ],
  },
];

export default () => {
  // 模拟 location.pathname (实际使用时，不需要设置 pathname)
  const [pathname, setPathname] = useState('/mgr/get-user');

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
          <CustomBreadcrumb.Renderer
            prefix={{ path: '/home', text: '首页' }}
            onLinkClick={(link, e) => {
              // 修改 pathname 模拟跳转 （Demo 演示用）
              e.preventDefault();
              if (link.path) setPathname(link.path);
            }}
          />
        </div>
        <div style={{ padding: '0 16px' }}>
          {pathname === '/mgr/get-user' && (
            <div>
              <h3>用户列表页面</h3>
              <Button
                onClick={() => {
                  setPathname('/mgr/get-user/detail');
                }}
              >
                进入用户详情
              </Button>
            </div>
          )}
          {pathname === '/mgr/get-user/detail' && (
            <div>
              <h3>用户详情页面</h3>
              <CustomBreadcrumb path="/mgr/get-user/detail" text="用户详情" />
              <div>注意：当前面包屑的最后一项为自定义面内容</div>
              <Skeleton avatar paragraph={{ rows: 4 }} />
            </div>
          )}
        </div>
      </MenuLayout>
    </div>
  );
};
