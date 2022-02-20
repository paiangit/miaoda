import { useMutation } from 'react-query';
import request from '../../../utils/request';
import { User } from '../../../types';
import { message } from 'antd';

// 接口封装层
const createUser = async (data) => {
  const result = await request({
    method: 'post',
    url: '/user/create',
    data,
  });

  return result.data as User | undefined;
}

// hook封装层
export default function useCreateUser() {
  return useMutation(
    async (data: Partial<User>) => createUser(data),
    {
      onSuccess(data, variables, context) {
        message.success('创建成功！');
      },
      onError(err: Error, variables, context) {
        console.log('创建失败', err.message);
        message.error('创建失败！');
      },
    }
  )
}
