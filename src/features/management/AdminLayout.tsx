import { Layout, Menu } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import style from './AdminLayout.module.less';

export default function AdminLayout() {
  const { Header, Content, Footer, Sider } = Layout;
  const { SubMenu } = Menu;

  const menu = [
    {
      name: '首页',
      to: '/',
      key: 'menu1',
    },
    {
      name: '页面管理',
      to: '/app/1/admin/123',
      key: 'menu3',
    },
    {
      name: '应用设置',
      to: '/app/1/admin/appSettings',
      key: 'menu5',
    },
    {
      name: '应用发布',
      to: '/app/1/admin/appPublish',
      key: 'menu4',
    },
    {
      name: '页面编辑',
      to: '/app/1/design/123',
      key: 'menu6',
    },
    {
      name: '应用预览',
      to: '/app/1/preview/123',
      key: 'menu7',
    },
  ];

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
    <div className={ style['management-admin-layout'] }>
      <Layout>
        <Header>
          <div/>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            { generateMenu() }
          </Menu>
        </Header>
        <Content>
          <Layout>
            <Sider width={200}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%' }}
              >
                <SubMenu key="sub1" title="subnav 1">
                  <Menu.Item key="1">option1</Menu.Item>
                  <Menu.Item key="2">option2</Menu.Item>
                  <Menu.Item key="3">option3</Menu.Item>
                  <Menu.Item key="4">option4</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title="subnav 2">
                  <Menu.Item key="5">option5</Menu.Item>
                  <Menu.Item key="6">option6</Menu.Item>
                  <Menu.Item key="7">option7</Menu.Item>
                  <Menu.Item key="8">option8</Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" title="subnav 3">
                  <Menu.Item key="9">option9</Menu.Item>
                  <Menu.Item key="10">option10</Menu.Item>
                  <Menu.Item key="11">option11</Menu.Item>
                  <Menu.Item key="12">option12</Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Content style={{ padding: 24 }}>
              <Outlet />
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Miao Da ©2022 by Paian</Footer>
      </Layout>
    </div>
  );
}
