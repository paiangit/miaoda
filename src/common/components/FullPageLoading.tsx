import { Spin } from 'antd';
import { FullPage } from './FullPage';
import './FullPageLoading.less';

export const FullPageLoading = () => {
  return (
    <FullPage className="common-full-page-loading">
      <Spin></Spin>
    </FullPage>
  );
};
