import { Layout, /* Menu */ } from 'antd';
import { Outlet, /* Link */ } from 'react-router-dom';
import './PreviewLayout.less';

export default function PreviewLayout() {
  const { Header, Content, Footer, Sider } = Layout;
  // const { SubMenu } = Menu;

  // const menu = [
  //   {
  //     name: '首页',
  //     to: '/',
  //     key: 'menu1',
  //   },
  //   // {
  //   //   name: '页面管理',
  //   //   to: '/app/1/admin/123',
  //   //   key: 'menu3',
  //   // },
  //   // {
  //   //   name: '应用设置',
  //   //   to: '/app/1/admin/appSettings',
  //   //   key: 'menu5',
  //   // },
  //   // {
  //   //   name: '应用发布',
  //   //   to: '/app/1/admin/appPublish',
  //   //   key: 'menu4',
  //   // },
  //   // {
  //   //   name: '页面编辑',
  //   //   to: '/app/1/design/123',
  //   //   key: 'menu6',
  //   // },
  //   // {
  //   //   name: '应用预览',
  //   //   to: '/app/1/preview/123',
  //   //   key: 'menu7',
  //   // },
  // ];

  // const generateMenu = () => menu.map(item => {
  //   return (
  //     <Menu.Item key={item.key}>
  //       <Link to={item.to}>
  //         {item.name}
  //       </Link>
  //     </Menu.Item>
  //   )
  // });

  return (
    <div className="preview-preview-layout">
      <Layout>
        {/* <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            { generateMenu() }
          </Menu>
        </Header> */}
        <Content>
          <Layout className="site-layout-background">
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
