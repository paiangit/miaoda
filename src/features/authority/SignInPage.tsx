import { useRef } from 'react';
import { Button, message } from 'antd';
import './SignInPage.less';
import api from './api.ts';

export default function SignInPage() {
  const signInFormRef = useRef();

  function clickHandler() {
    return (e) => {
      e.preventDefault();

      const username = signInFormRef.current.username.value;
      const password = signInFormRef.current.password.value;

      api
        .signIn({
          username,
          password,
        })
        .then((res) => {
          if (res.code === 0) {
            message.success('登录成功');
          }
        });
    };
  }

  return (
    <div className="authority-sign-in-page">
      <h2 className="title">Sign in</h2>
      <form ref={signInFormRef}>
        <label className="label" htmlFor="username">Username</label>
        <input type="text" name="username" id="username"></input>
        <label className="label" htmlFor="password">Password</label>
        <input type="password" name="password" id="password"></input>

        <Button className="sign-in" type="primary" onClick={clickHandler()}>Sign in</Button>
      </form>
    </div>
  );
}
