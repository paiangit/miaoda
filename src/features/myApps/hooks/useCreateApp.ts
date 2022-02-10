import { message } from 'antd';
import { useMutation } from 'react-query';
import { request } from '../../../common/utils';
import { App } from '../../../common/types';

// 接口封装层
export const createApp = async (params: App) => {
  const result = await request({
    method: 'post',
    url: '/app/create',
    data: params,
  });

  return result.data as App | undefined;
};

// hook封装层
export const useCreateApp = () => {
  return useMutation(async (params: App) => createApp(params), {
    onSuccess(data, variables, context) {
      message.success('创建成功！');
    },
    onError(err: Error, variables, context) {
      console.log('创建失败', err);
      message.error('创建失败！');
    },
  });
};
