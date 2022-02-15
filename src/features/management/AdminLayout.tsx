import { Button } from 'antd';
import { Outlet } from 'react-router-dom';
import './AdminLayout.less';

export default function AdminLayout() {
  const handleClick = () => {
    window.history.go(-1);
  };

  return (
    <div className="management-admin-layout">
      <div>Admin layout</div>
      <Outlet />
      <br />
      <Button type="link" onClick={handleClick}>返回</Button>
    </div>
  );
}
