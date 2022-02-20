import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useMutation } from 'react-query';
import request from '../../../utils/request';
import { App } from '../../../types';

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
export default function useCreateApp () {
  const navigate = useNavigate();

  return useMutation(
    async (params: App) => createApp(params),
    {
      onSuccess(data, variables, context) {
        message.success('创建成功！');
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      },
      onError(err: Error, variables, context) {
        console.log('创建失败', err);
        message.error('创建失败！');
      },
    },
  );
};
