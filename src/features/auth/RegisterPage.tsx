import { useRef } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from './api.ts';
import './RegisterPage.less';

export default function RegisterPage() {
  const registerForm = useRef();
  const navigate = useNavigate();

  function clickHandler(e) {
    e.preventDefault();
    const username = registerForm.current.username.value;
    const password = registerForm.current.password.value;
    const retypePassword = registerForm.current.retypePassword.value;
    const email = registerForm.current.email.value;

    if (retypePassword !== password) return;

    // 注册之前移除登录token
    window.localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN_KEY);

    api
      .createUser({
        username,
        password,
        email,
      })
      .then((res) => {
        console.log(res);
        if (res.code === 0) {
          navigate('/auth/login');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="auth-register-page">
      <h2 className="title">注册</h2>
      <form ref={registerForm}>
        <label className="label" htmlFor="username">
          用户名
        </label>
        <input type="text" name="username" id="username"></input>
        <label className="label" htmlFor="password">
          密码
        </label>
        <input type="password" name="password" id="password"></input>
        <label className="label" htmlFor="retypePassword">
          再次输入密码
        </label>
        <input
          type="password"
          name="retypePassword"
          id="retypePassword"
        ></input>
        <label className="label" htmlFor="email">
          Email地址
        </label>
        <input type="text" name="email" id="email"></input>

        <Button className="register" type="primary" onClick={clickHandler}>
          注册
        </Button>
      </form>
    </div>
  );
}
