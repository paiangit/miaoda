import { Spin } from 'antd';
import styles from './Loading.module.less';

export const Loading = () => {
  return (
    <div className={ styles['common-loading'] }>
      <Spin></Spin>
    </div>
  );
};
