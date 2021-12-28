import {
  Link,
  Outlet
} from 'react-router-dom';
import './MainLayout.less';

export default function MainLayout() {
  return (
    <div className="home-main-layout">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/myApps">My Apps</Link></li>
        <li><Link to="/app/1/admin/123">Page Management for app 1 page 123</Link></li>
        <li><Link to="/app/1/admin/appPublish">Publish app 1</Link></li>
        <li><Link to="/app/1/admin/appSettings">Settings for app 1</Link></li>
        <li><Link to="/app/1/design?pageId=123">Design app 1 page 123</Link></li>
        <li><Link to="/app/1/preview?pageId=123">Preview app 1 page 123</Link></li>
      </ul>
      <Outlet />
    </div>
  );
}
