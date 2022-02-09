import { message } from 'antd';
import { useMutation } from 'react-query';
import { request } from '../../../common/utils';
import { App, MutationParams } from '../../../common/types';

// 类型声明
export type CreateAppParams = App & MutationParams;

// 接口封装层
export const createApp = async (params: CreateAppParams) => {
  const result = await request({
    method: 'post',
    url: '/app/create',
    data: params,
  });

  return result.data as App | undefined;
};

// hook封装层
export const useCreateApp = () => {
  return useMutation(async (params: CreateAppParams) => createApp(params), {
    onSuccess(data, variables, context) {
      message.success('创建成功！');
      variables.onSuccess && variables.onSuccess();
    },
    onError(err: Error, variables, context) {
      console.log('创建失败', err);
      variables.onError && variables.onError();
      message.error('创建失败！');
    },
  });
};
