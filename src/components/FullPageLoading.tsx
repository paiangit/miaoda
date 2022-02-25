import { Spin } from 'antd';
import { FullPage } from './FullPage';
import style from './FullPageLoading.module.less';

export const FullPageLoading = () => {
  return (
    <FullPage className={ style['common-full-page-loading'] }>
      <Spin></Spin>
    </FullPage>
  );
};
