import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './CheckLoginApi.ts';

// 登录高阶组件
export default function CheckLogin(Component) {
  const navigate = useNavigate();

  useEffect(() => {
    api
      .checkLogin()
      .then(res => {
        console.log('已登录', res);
      })
      .catch(err => {
        // console.log('未登录', err);
        navigate('/auth/login');
      });
  }, []);

  return function () {
    return (<Component />);
  }
}
