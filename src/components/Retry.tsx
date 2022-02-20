import { Typography, Button } from 'antd';
import './Retry.less';

export const Retry = () => {
  const handleClick = () => window.location.reload();

  return (
    <div className="common-retry">
      <Typography.Text type="danger" >服务器开小差了，请稍侯重试~</Typography.Text>
      <Button className="reload" type="primary" onClick={handleClick}>重试</Button>
    </div>
  );
}
