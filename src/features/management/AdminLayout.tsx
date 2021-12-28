import {
  Outlet,
  Link,
} from 'react-router-dom';
import './AdminLayout.less';

export default function AdminLayout() {
  return (
    <div className="management-admin-layout">
      <div>Admin layout</div>
      <Outlet />
      <br />
      <button>
        <Link to='/'>Back</Link>
      </button>
    </div>
  );
}
