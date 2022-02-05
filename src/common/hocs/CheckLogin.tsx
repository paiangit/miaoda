import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

// 登录高阶组件
export function CheckLogin(Component) {
  const navigate = useNavigate();

  useEffect(() => {
    api
      .checkLogin()
      .then((res) => {
        console.log('已登录', res);
      })
      .catch((err) => {
        // console.log('未登录', err);
        navigate('/auth/login');
      });
  }, []);

  return function () {
    return <Component />;
  };
}
