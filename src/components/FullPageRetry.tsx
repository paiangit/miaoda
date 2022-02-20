import { Typography, Button } from 'antd';
import './FullPageRetry.less';

export const FullPageRetry = () => {
  const handleClick = () => window.location.reload();

  return (
    <div className="common-full-page-retry">
      <div className="inner">
        <Typography.Text type="danger" >服务器开小差了，请稍侯重试~</Typography.Text>
        <Button className="reload" type="primary" onClick={handleClick}>重试</Button>
      </div>
    </div>
  );
}
