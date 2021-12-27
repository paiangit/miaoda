import {
  Link,
  Outlet
} from 'react-router-dom';
import './Layout.less';

export default function Layout() {
  return (
    <div className="layout">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/project/1">Project 1</Link></li>
        <li><Link to="/editor">Editor</Link></li>
      </ul>
      <Outlet />
    </div>
  );
}
