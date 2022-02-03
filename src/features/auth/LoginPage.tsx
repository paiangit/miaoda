import { useRef } from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './LoginPage.less';
import api from './api.ts';

export default function LoginPage() {
  const loginFormRef = useRef();
  const navigate = useNavigate();

  function clickHandler() {
    return (e) => {
      e.preventDefault();

      const username = loginFormRef.current.username.value;
      const password = loginFormRef.current.password.value;

      api
        .login({
          username,
          password,
        })
        .then((res) => {
          if (res.code === 0) {
            let { token, id, username } = res.data;
            if (token) {
              window.localStorage.setItem(
                process.env.REACT_APP_ACCESS_TOKEN_KEY,
                token
              );
              window.localStorage.setItem(
                process.env.REACT_APP_USER_INFO_KEY,
                JSON.stringify({ id, username })
              );
              message.success('登录成功');
              setTimeout(() => {
                navigate(`/user/${id}/profile`);
              }, 3000);
            }
          }
        });
    };
  }

  return (
    <div className="auth-sign-in-page">
      <h2 className="title">Login</h2>
      <form ref={loginFormRef}>
        <label className="label" htmlFor="username">
          用户名
        </label>
        <input type="text" name="username" id="username"></input>
        <label className="label" htmlFor="password">
          密码
        </label>
        <input type="password" name="password" id="password"></input>

        <Button className="sign-in" type="primary" onClick={clickHandler()}>
          登录
        </Button>
      </form>
    </div>
  );
}
