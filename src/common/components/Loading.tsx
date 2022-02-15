import { Spin } from 'antd';
import './Loading.less';

export const Loading = () => {
  return (
    <div className="common-loading">
      <Spin></Spin>
    </div>
  );
};
