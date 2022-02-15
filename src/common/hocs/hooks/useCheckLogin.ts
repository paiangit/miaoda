
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { request } from '../../utils';

interface CheckLoginResult {
  isLogin: boolean;
}

const checkLogin = async () => {
  const result = await request({
    method: 'post',
    url: '/auth/checkLogin',
  });

  return result.data as CheckLoginResult | undefined;
}

export const useCheckLogin = () => {
  const navigate = useNavigate();

  return useMutation(
    async () => checkLogin(),
    {
      // onSuccess(data, virables, context) {
      // },
      onError(error, virables, context) {
        // console.log('未登录', err);
        navigate('/auth/login');
      }
    }
  )
}
