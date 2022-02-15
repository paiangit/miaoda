import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './MainLayout.less';

function MainLayout() {
  const { Header, Content, Footer } = Layout;
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const userInfo = window.localStorage.getItem(process.env.REACT_APP_USER_INFO_KEY);
    const userId = JSON.parse(userInfo).id;

    const data = [
      {
        name: '首页',
        to: '/',
        key: 'menu1',
      },
      {
        name: '我的应用',
        to: `/user/${userId}/myApps`,
        key: 'menu2',
      },
      {
        name: '我的档案',
        to: `/user/${userId}/profile`,
        key: 'menu10',
      },
      // {
      //   name: 'Management app 1 page 123',
      //   to: '/app/1/admin/123',
      //   key: 'menu3',
      // },
      // {
      //   name: 'Publish app 1',
      //   to: '/app/1/admin/appPublish',
      //   key: 'menu4',
      // },
      // {
      //   name: 'Settings app 1',
      //   to: '/app/1/admin/appSettings',
      //   key: 'menu5',
      // },
      // {
      //   name: 'Design app 1 page 123',
      //   to: '/app/1/design/123',
      //   key: 'menu6',
      // },
      // {
      //   name: 'Preview app 1 page 123',
      //   to: '/app/1/preview/123',
      //   key: 'menu7',
      // },
      {
        name: '注册',
        to: '/auth/register',
        key: 'menu8',
      },
      {
        name: '登录',
        to: '/auth/login',
        key: 'menu9',
      },
      // {
      //   name: '计数器例子',
      //   to: '/examples/counter',
      //   key: 'menu11',
      // },
    ];

    setMenu(data);
  }, [])

  const generateMenu = () => menu.map(item => {
    return (
      <Menu.Item key={item.key}>
        <Link to={item.to}>
          {item.name}
        </Link>
      </Menu.Item>
    )
  });

  return (
    <div className="home-main-layout">
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            { generateMenu() }
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Layout>
            <Content>
              <Outlet />
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Miao Da ©2022 by Paian</Footer>
      </Layout>
    </div>
  );
}

export default React.memo(MainLayout, () => false);
