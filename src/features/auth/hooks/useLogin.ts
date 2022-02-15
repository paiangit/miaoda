import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { request } from '../../../common/utils';
import { User } from '../../../common/types';
import { message } from 'antd';

// 接口封装层
const login = async (data) => {
  const result = await request({
    method: 'post',
    url: '/auth/login',
    data,
  });

  return result.data as User || undefined;
}

// hook封装层
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation(
    async (data: User) => login(data),
    {
      onSuccess(data, variables, context) {
        let { token, id, username } = data;
        window.localStorage.setItem(
          process.env.REACT_APP_ACCESS_TOKEN_KEY,
          token
        );
        window.localStorage.setItem(
          process.env.REACT_APP_USER_INFO_KEY,
          JSON.stringify({ id, username })
        );
        message.success('登录成功！');
        if (token) {
          setTimeout(() => {
            navigate(`/user/${id}/myApps`);
          }, 2000);
        }
      },
      onError(err: Error, variables, context) {
        console.log('登录失败', err.message);
        message.error('登录失败！');
      },
    }
  )
}
