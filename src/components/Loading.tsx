import { Spin } from 'antd';
import style from './Loading.module.less';

export const Loading = () => {
  return (
    <div className={ style['common-loading'] }>
      <Spin></Spin>
    </div>
  );
};
