import { useRef } from 'react';
import { Form, Button, message, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../common/hooks';
import api from './api';
import './LoginPage.less';

export default function LoginPage() {
  useDocumentTitle('用户登录');

  const navigate = useNavigate();

  const handleFinish = (values) => {
    api.login(values).then((res) => {
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

  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  return (
    <div className="auth-sign-in-page">
      <h2 className="title">用户登录</h2>
      <Form form={form} {...layout} onFinish={handleFinish}>
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
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
