import { Typography, Button } from 'antd';
import styles from './Retry.module.less';

export const Retry = () => {
  const handleClick = () => window.location.reload();

  return (
    <div className={ styles['common-retry'] }>
      <Typography.Text type="danger" >服务器开小差了，请稍侯重试~</Typography.Text>
      <Button className={ styles['reload'] } type="primary" onClick={handleClick}>重试</Button>
    </div>
  );
}
