import { Typography, Button } from 'antd';
import style from './FullPageRetry.module.less';

export const FullPageRetry = () => {
  const handleClick = () => window.location.reload();

  return (
    <div className={ style['common-full-page-retry'] }>
      <div className={ style['inner'] }>
        <Typography.Text type="danger" >服务器开小差了，请稍侯重试~</Typography.Text>
        <Button className={ style['reload'] } type="primary" onClick={handleClick}>重试</Button>
      </div>
    </div>
  );
}
