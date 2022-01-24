import React from 'react';
import {
  Link,
  Outlet
} from 'react-router-dom';
import './MainLayout.less';

function MainLayout() {
  return (
    <div className="home-main-layout">
      <ul className="demo-nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/myApps">My Apps</Link></li>
        <li><Link to="/app/1/admin/123">Page Management for app 1 page 123</Link></li>
        <li><Link to="/app/1/admin/appPublish">Publish app 1</Link></li>
        <li><Link to="/app/1/admin/appSettings">Settings for app 1</Link></li>
        <li><Link to="/app/1/design?pageId=123">Design app 1 page 123</Link></li>
        <li><Link to="/app/1/preview?pageId=123">Preview app 1 page 123</Link></li>
        <li><Link to="/authority/register">register</Link></li>
        <li><Link to="/authority/signIn">sign in</Link></li>
        <li><Link to="/user/1/profile">profile</Link></li>
        <li><Link to="/examples/counter">examples counter</Link></li>
      </ul>
      <Outlet />
    </div>
  );
}

export default React.memo(MainLayout, () => false);
