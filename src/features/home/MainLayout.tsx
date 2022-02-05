import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './MainLayout.less';

function MainLayout() {
  return (
    <div className="home-main-layout">
      <ul className="demo-nav">
        <li>
          <Link to="/">首页</Link>
        </li>
        <li>
          <Link to="/myApps">我的应用</Link>
        </li>
        <li>
          <Link to="/app/1/admin/123">Page Management for app 1 page 123</Link>
        </li>
        <li>
          <Link to="/app/1/admin/appPublish">Publish app 1</Link>
        </li>
        {/* <li><Link to="/app/1/admin/appSettings">Settings for app 1</Link></li> */}
        <li>
          <Link to="/app/1/design?pageId=123">Design app 1 page 123</Link>
        </li>
        <li>
          <Link to="/app/1/preview?pageId=123">Preview app 1 page 123</Link>
        </li>
        <li>
          <Link to="/auth/register">注册</Link>
        </li>
        <li>
          <Link to="/auth/login">登录</Link>
        </li>
        <li>
          <Link to="/user/1/profile">我的档案</Link>
        </li>
        <li>
          <Link to="/examples/counter">计数器例子</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default React.memo(MainLayout, () => false);
