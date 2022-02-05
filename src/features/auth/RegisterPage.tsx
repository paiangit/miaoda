import { useRef } from 'react';
import { Form, Button, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { useDocumentTitle } from '../../common/hooks';
import './RegisterPage.less';

export default function RegisterPage() {
  useDocumentTitle('用户注册');

  const [form] = Form.useForm();
  const navigate = useNavigate();

  function handleFinish(values) {
    const { username, email, password, retypePassword } = values;

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
          message.success('注册成功！');
          setTimeout(() => {
            navigate('/auth/login');
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  return (
    <div className="auth-register-page">
      <h2 className="title">用户注册</h2>
      <Form {...layout} form={form} onFinish={handleFinish}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input maxLength={14} />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password maxLength={14} />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="retypePassword"
          rules={[
            {
              required: true,
              message: '请输入确认密码',
            },
          ]}
        >
          <Input.Password maxLength={14} />
        </Form.Item>
        <Form.Item
          label="E-mail"
          name="email"
          rules={[
            {
              required: true,
              message: '请输入你的E-mail',
            },
            {
              type: 'email',
              message: '不是合法的E-mail',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
