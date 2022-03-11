import { Spin } from 'antd';
import { FullPage } from './FullPage';
import styles from './FullPageLoading.module.less';

export const FullPageLoading = () => {
  return (
    <FullPage className={ styles['common-full-page-loading'] }>
      <Spin></Spin>
    </FullPage>
  );
};
